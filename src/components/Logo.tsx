export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className="shrink-0"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="air-a" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#0d47a1" />
          <stop offset="100%" stopColor="#1565c0" />
        </linearGradient>
        <linearGradient id="air-b" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#1565c0" />
          <stop offset="100%" stopColor="#1976d2" />
        </linearGradient>
        <linearGradient id="air-c" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#1976d2" />
          <stop offset="100%" stopColor="#2196f3" />
        </linearGradient>
        <linearGradient id="air-d" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#2196f3" />
          <stop offset="100%" stopColor="#64b5f6" />
        </linearGradient>
        <radialGradient id="air-e" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e3f2fd" />
          <stop offset="25%" stopColor="#bbdefb" />
          <stop offset="55%" stopColor="#64b5f6" />
          <stop offset="100%" stopColor="#42a5f5" />
        </radialGradient>
      </defs>
      <g transform="translate(100,100)">
        <polygon points="0,-94 81.4,-47 81.4,47 0,94 -81.4,47 -81.4,-47" fill="url(#air-a)" />
        <polygon points="0,-94 81.4,-47 81.4,47 0,94 -81.4,47 -81.4,-47" fill="url(#air-a)" transform="rotate(30)" />
        <polygon points="0,-74 64.1,-37 64.1,37 0,74 -64.1,37 -64.1,-37" fill="url(#air-b)" />
        <polygon points="0,-74 64.1,-37 64.1,37 0,74 -64.1,37 -64.1,-37" fill="url(#air-b)" transform="rotate(30)" />
        <polygon points="0,-54 46.8,-27 46.8,27 0,54 -46.8,27 -46.8,-27" fill="url(#air-c)" />
        <polygon points="0,-54 46.8,-27 46.8,27 0,54 -46.8,27 -46.8,-27" fill="url(#air-c)" transform="rotate(30)" />
        <polygon points="0,-38 32.9,-19 32.9,19 0,38 -32.9,19 -32.9,-19" fill="url(#air-d)" />
        <polygon points="0,-38 32.9,-19 32.9,19 0,38 -32.9,19 -32.9,-19" fill="url(#air-d)" transform="rotate(30)" />
        <circle cx="0" cy="0" r="24" fill="url(#air-e)" />
        <circle cx="0" cy="0" r="8" fill="#FFF" opacity="0.4" />
        <circle cx="0" cy="0" r="3.5" fill="#FFF" opacity="0.95" />
      </g>
    </svg>
  );
}
