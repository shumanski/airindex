'use client';

/**
 * Leaflet canvas layer that renders a discrete AQI grid as semi-transparent
 * colored cells. Grid data is fetched once from /api/aqi-grid and decoded
 * from binary. Cells are drawn in container-pixel space.
 *
 * Positioning strategy (the tricky part):
 *   The canvas is appended directly to map.getContainer() — NOT to an
 *   overlayPane whose own CSS transform would compound with ours. The
 *   canvas is a plain full-viewport overlay; every cell's screen position
 *   is recomputed via map.latLngToContainerPoint(…) on each redraw.
 *
 *   During a zoom animation we intercept the `zoomanim` event and apply a
 *   CSS `scale+translate` to the canvas so it visually tracks the zoom; at
 *   `zoomend` we reset the transform and redraw from scratch.
 */
import { getAqiColor } from '@/lib/aqi-utils';

export interface AqiGridLayerOptions {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
  spacing: number;
  opacity?: number; // default 0.45
}

interface DecodedGrid {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
  spacing: number;
  width: number;
  height: number;
  aqi: Int16Array;
}

function decodeGrid(buf: ArrayBuffer): DecodedGrid {
  const view = new DataView(buf);
  let p = 0;
  const ver = view.getUint8(p); p += 1;
  if (ver !== 1) throw new Error('unsupported grid version ' + ver);
  const minLat = view.getFloat32(p, true); p += 4;
  const maxLat = view.getFloat32(p, true); p += 4;
  const minLon = view.getFloat32(p, true); p += 4;
  const maxLon = view.getFloat32(p, true); p += 4;
  const spacing = view.getFloat32(p, true); p += 4;
  const width = view.getUint16(p, true); p += 2;
  const height = view.getUint16(p, true); p += 2;
  const aqi = new Int16Array(width * height);
  for (let i = 0; i < aqi.length; i++) {
    aqi[i] = view.getInt16(p, true); p += 2;
  }
  return { minLat, maxLat, minLon, maxLon, spacing, width, height, aqi };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type L = any;

export interface AqiGridLayerHandle {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addTo(map: any): AqiGridLayerHandle;
  remove(): void;
  setOpacity(o: number): void;
}

export function createAqiGridLayer(
  L: L,
  opts: AqiGridLayerOptions,
): AqiGridLayerHandle {
  const opacity = opts.opacity ?? 0.45;

  async function fetchGrid(): Promise<DecodedGrid> {
    const url = new URL('/api/aqi-grid', window.location.origin);
    url.searchParams.set('minLat', String(opts.minLat));
    url.searchParams.set('maxLat', String(opts.maxLat));
    url.searchParams.set('minLon', String(opts.minLon));
    url.searchParams.set('maxLon', String(opts.maxLon));
    url.searchParams.set('spacing', String(opts.spacing));
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('grid http ' + res.status);
    const buf = await res.arrayBuffer();
    return decodeGrid(buf);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const proto: any = {
    onAdd(this: unknown, map: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const self = this as any;
      self._map = map;
      const canvas = L.DomUtil.create('canvas', 'aqi-grid-layer');
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.pointerEvents = 'none';
      canvas.style.opacity = String(opacity);
      canvas.style.zIndex = '200';
      canvas.style.transformOrigin = '0 0';
      self._canvas = canvas;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (map as any).getContainer().appendChild(canvas);

      self._redraw = () => redraw(self);
      self._animateZoom = (
        e: { center: { lat: number; lng: number }; zoom: number },
      ) => animateZoom(self, e);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const m = map as any;
      m.on('moveend', self._redraw);
      m.on('zoomend', self._redraw);
      m.on('viewreset', self._redraw);
      m.on('resize', self._redraw);
      m.on('zoomanim', self._animateZoom);

      fetchGrid().then((g) => {
        self._grid = g;
        self._redraw();
      }).catch((err) => console.error('[aqi-grid] fetch failed:', err));
    },

    onRemove(this: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const self = this as any;
      if (self._canvas?.parentNode) {
        self._canvas.parentNode.removeChild(self._canvas);
      }
      const m = self._map;
      if (m && self._redraw) {
        m.off('moveend', self._redraw);
        m.off('zoomend', self._redraw);
        m.off('viewreset', self._redraw);
        m.off('resize', self._redraw);
        m.off('zoomanim', self._animateZoom);
      }
      self._canvas = undefined;
      self._map = undefined;
    },

    setOpacity(this: unknown, o: number) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const self = this as any;
      if (self._canvas) self._canvas.style.opacity = String(o);
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function redraw(self: any) {
    const canvas: HTMLCanvasElement | undefined = self._canvas;
    const map = self._map;
    const grid: DecodedGrid | undefined = self._grid;
    if (!canvas || !map || !grid) return;

    const size = map.getSize();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.ceil(size.x * dpr);
    canvas.height = Math.ceil(size.y * dpr);
    canvas.style.width = size.x + 'px';
    canvas.style.height = size.y + 'px';
    canvas.style.transform = '';

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size.x, size.y);

    const { minLat, maxLat, minLon, maxLon, spacing, width: gw, height: gh, aqi } = grid;
    void minLon; void maxLon;

    // Viewport bbox in lat/lon — used to skip off-screen cells cheaply.
    const bounds = map.getBounds();
    const vMinLat = bounds.getSouth();
    const vMaxLat = bounds.getNorth();
    const vMinLon = bounds.getWest();
    const vMaxLon = bounds.getEast();
    const half = spacing / 2;
    const crossesAntimeridian = vMaxLon < vMinLon;

    for (let y = 0; y < gh; y++) {
      const cLat = maxLat - y * spacing;
      const cellTop = cLat + half;
      const cellBot = cLat - half;
      if (cellBot > vMaxLat || cellTop < vMinLat) continue;

      for (let x = 0; x < gw; x++) {
        const v = aqi[y * gw + x];
        if (v < 0) continue;
        const cLon = minLon + x * spacing;
        const cellLeft = cLon - half;
        const cellRight = cLon + half;
        if (!crossesAntimeridian) {
          if (cellRight < vMinLon || cellLeft > vMaxLon) continue;
        }

        const p1 = map.latLngToContainerPoint([cellTop, cellLeft]);
        const p2 = map.latLngToContainerPoint([cellBot, cellRight]);
        const px = p1.x;
        const py = p1.y;
        const w = p2.x - p1.x;
        const h = p2.y - p1.y;
        if (w <= 0 || h <= 0) continue;
        if (px + w < 0 || py + h < 0 || px > size.x || py > size.y) continue;
        ctx.fillStyle = getAqiColor(v);
        // +0.5 to avoid sub-pixel gaps between adjacent cells.
        ctx.fillRect(px, py, w + 0.5, h + 0.5);
      }
    }
  }

  // During Leaflet's zoom animation, match the map's CSS transform so the
  // canvas appears to scale/translate along with the basemap. After the
  // animation ends, `zoomend` triggers a fresh redraw that resets transform.
  function animateZoom(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    self: any,
    e: { center: { lat: number; lng: number }; zoom: number },
  ) {
    const canvas: HTMLCanvasElement | undefined = self._canvas;
    const map = self._map;
    if (!canvas || !map) return;
    const scale = map.getZoomScale(e.zoom, map.getZoom());
    // Translate vector: where the current top-left should move to.
    const offset = map._latLngToNewLayerPoint
      ? map._latLngToNewLayerPoint(
          map.containerPointToLatLng([0, 0]),
          e.zoom,
          e.center,
        )
      : { x: 0, y: 0 };
    canvas.style.transformOrigin = '0 0';
    canvas.style.transform = `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`;
  }

  const LayerClass = L.Layer.extend(proto);
  return new LayerClass();
}

