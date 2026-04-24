'use client';

/**
 * Leaflet canvas layer that renders a discrete AQI grid as semi-transparent
 * colored cells. Grid data is fetched once from /api/aqi-grid and decoded
 * from binary. Cells are drawn in map-pixel space and re-drawn on zoom/pan.
 *
 * Colors come from getAqiColor() to match the site's palette.
 *
 * Usage:
 *   const layer = createAqiGridLayer(L, { minLat, maxLat, minLon, maxLon, spacing, opacity? });
 *   layer.addTo(map);
 *   layer.remove();
 */
import { getAqiColor } from '@/lib/aqi-utils';

export interface AqiGridLayerOptions {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
  spacing: number;
  opacity?: number;  // default 0.45
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

// Minimal Leaflet types (we don't want to add runtime dep on L at import).
interface LatLng { lat: number; lng: number }
interface Point { x: number; y: number; }
interface Bounds { getNorthWest(): LatLng; getSouthEast(): LatLng }
interface LMap {
  getBounds(): Bounds;
  getSize(): Point;
  getPixelBounds(): { min: Point; max: Point };
  latLngToLayerPoint(ll: LatLng | [number, number]): Point;
  on(ev: string, fn: () => void): void;
  off(ev: string, fn: () => void): void;
  getPanes(): { overlayPane: HTMLElement };
  _mapPane?: HTMLElement;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type L = any;

export interface AqiGridLayerHandle {
  addTo(map: LMap): AqiGridLayerHandle;
  remove(): void;
  setOpacity(o: number): void;
}

export function createAqiGridLayer(
  L: L,
  opts: AqiGridLayerOptions,
): AqiGridLayerHandle {
  const opacity = opts.opacity ?? 0.45;

  const Layer = L.Layer.extend({
    onAdd(this: { _canvas?: HTMLCanvasElement; _map?: LMap }, map: LMap) {
      this._map = map;
      const pane = map.getPanes().overlayPane;
      const canvas = document.createElement('canvas');
      canvas.className = 'aqi-grid-layer';
      canvas.style.position = 'absolute';
      canvas.style.pointerEvents = 'none';
      canvas.style.opacity = String(opacity);
      canvas.style.zIndex = '200';
      canvas.style.imageRendering = 'pixelated';
      this._canvas = canvas;
      pane.appendChild(canvas);

      fetchGrid().then((g) => {
        (this as unknown as { _grid: DecodedGrid })._grid = g;
        redraw(this as unknown as DrawCtx);
      }).catch((e) => console.error('[aqi-grid] fetch failed:', e));

      const onMove = () => redraw(this as unknown as DrawCtx);
      (this as unknown as { _onMove: () => void })._onMove = onMove;
      map.on('zoomend', onMove);
      map.on('moveend', onMove);
      map.on('resize', onMove);
      // Also redraw during zoom animation frames so the canvas stays aligned.
      map.on('zoom', onMove);
      map.on('move', onMove);
    },
    onRemove(this: { _canvas?: HTMLCanvasElement; _map?: LMap; _onMove?: () => void }) {
      if (this._canvas?.parentNode) this._canvas.parentNode.removeChild(this._canvas);
      if (this._map && this._onMove) {
        this._map.off('zoomend', this._onMove);
        this._map.off('moveend', this._onMove);
        this._map.off('resize', this._onMove);
        this._map.off('zoom', this._onMove);
        this._map.off('move', this._onMove);
      }
      this._canvas = undefined;
      this._map = undefined;
    },
    setOpacity(this: { _canvas?: HTMLCanvasElement }, o: number) {
      if (this._canvas) this._canvas.style.opacity = String(o);
    },
  });

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

  interface DrawCtx {
    _canvas?: HTMLCanvasElement;
    _map?: LMap;
    _grid?: DecodedGrid;
  }

  function redraw(self: DrawCtx) {
    const canvas = self._canvas;
    const map = self._map;
    const grid = self._grid;
    if (!canvas || !map || !grid) return;

    const pixelBounds = map.getPixelBounds();
    const topLeft = pixelBounds.min;
    const size = map.getSize();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.ceil(size.x * dpr);
    canvas.height = Math.ceil(size.y * dpr);
    canvas.style.width = size.x + 'px';
    canvas.style.height = size.y + 'px';
    // Anchor the canvas to the top-left pixel of the current map viewport.
    // Leaflet's overlayPane is translated by -pixelOrigin, so we counter that
    // by positioning canvas at pixelBounds.min (= current pixel origin).
    canvas.style.transform = `translate3d(${topLeft.x}px, ${topLeft.y}px, 0)`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);

    const { minLat, maxLat, minLon, maxLon, spacing, width: gw, height: gh, aqi } = grid;

    for (let y = 0; y < gh; y++) {
      const cellLatTop = maxLat - y * spacing + spacing / 2;
      const cellLatBot = maxLat - y * spacing - spacing / 2;
      for (let x = 0; x < gw; x++) {
        const v = aqi[y * gw + x];
        if (v < 0) continue;
        const cellLonL = minLon + x * spacing - spacing / 2;
        const cellLonR = minLon + x * spacing + spacing / 2;
        // Convert cell bounds to layer pixels.
        const p1 = map.latLngToLayerPoint({ lat: cellLatTop, lng: cellLonL });
        const p2 = map.latLngToLayerPoint({ lat: cellLatBot, lng: cellLonR });
        const px = p1.x - topLeft.x;
        const py = p1.y - topLeft.y;
        const w = p2.x - p1.x;
        const h = p2.y - p1.y;
        if (px + w < 0 || py + h < 0 || px > size.x || py > size.y) continue;
        if (w <= 0 || h <= 0) continue;
        ctx.fillStyle = getAqiColor(v);
        ctx.fillRect(px, py, w + 0.5, h + 0.5);
      }
    }

    // Reset transform for next redraw pass.
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    void minLon; void maxLon;
  }

  const handle = new Layer() as AqiGridLayerHandle;
  return handle;
}
