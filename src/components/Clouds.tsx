/**
 * Parallax cloud layers — pure CSS animation, zero JS cost.
 * Individual clouds placed at deterministic-random positions across the sky.
 * Multiple speed classes for depth/parallax.
 */

function Cloud({ cx, cy, scale }: { cx: number; cy: number; scale: number }) {
  return (
    <g transform={`translate(${cx},${cy}) scale(${scale})`}>
      <ellipse cx="0" cy="10" rx="60" ry="25" fill="var(--color-cloud)" />
      <ellipse cx="-30" cy="-2" rx="35" ry="22" fill="var(--color-cloud)" />
      <ellipse cx="25" cy="-5" rx="40" ry="25" fill="var(--color-cloud)" />
      <ellipse cx="0" cy="-12" rx="28" ry="18" fill="var(--color-cloud)" />
    </g>
  );
}

// Deterministic pseudo-random from seed
function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

interface CloudDef { cx: number; cy: number; scale: number }

function generateClouds(count: number, seed: number, yMin: number, yMax: number, scaleMin: number, scaleMax: number): CloudDef[] {
  const rand = seededRand(seed);
  const stripW = 4000;
  const out: CloudDef[] = [];
  for (let i = 0; i < count; i++) {
    out.push({
      cx: rand() * stripW,
      cy: yMin + rand() * (yMax - yMin),
      scale: scaleMin + rand() * (scaleMax - scaleMin),
    });
  }
  return out;
}

// Pre-generate cloud layouts (deterministic, no re-render variance)
const layer1Clouds = generateClouds(14, 42, 5, 75, 0.5, 1.0);
const layer2Clouds = generateClouds(12, 99, 5, 75, 0.7, 1.2);
const layer3Clouds = generateClouds(10, 7, 5, 75, 0.9, 1.5);

const STRIP_W = 4000;

function CloudSvgStrip({ clouds, opacity }: { clouds: CloudDef[]; opacity: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${STRIP_W} 80`}
      width={STRIP_W}
      height="100%"
      className="shrink-0"
      style={{ opacity }}
      aria-hidden="true"
    >
      {clouds.map((c, i) => (
        <Cloud key={i} cx={c.cx} cy={c.cy} scale={c.scale} />
      ))}
    </svg>
  );
}

function CloudLayer({ clouds, opacity, anim, top, height }: {
  clouds: CloudDef[]; opacity: number; anim: string; top: string; height: number;
}) {
  return (
    <div
      className={`absolute flex ${anim}`}
      style={{ top, height, width: STRIP_W * 2 }}
    >
      <CloudSvgStrip clouds={clouds} opacity={opacity} />
      <CloudSvgStrip clouds={clouds} opacity={opacity} />
    </div>
  );
}

const CLOUDS_ENABLED = true;

export default function Clouds() {
  if (!CLOUDS_ENABLED) return null;
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 5 }}
      aria-hidden="true"
    >
      <CloudLayer clouds={layer1Clouds} opacity={0.55} anim="animate-cloud-slow" top="0px"  height={70} />
      <CloudLayer clouds={layer2Clouds} opacity={0.45} anim="animate-cloud-mid"  top="30%"  height={80} />
      <CloudLayer clouds={layer3Clouds} opacity={0.35} anim="animate-cloud-fast" top="60%"  height={90} />
    </div>
  );
}
