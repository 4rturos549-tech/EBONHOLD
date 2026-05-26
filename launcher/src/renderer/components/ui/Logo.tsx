export function Logo({
  size = 36,
  className,
  withGlow = true,
}: {
  size?: number;
  className?: string;
  withGlow?: boolean;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      width={size}
      height={size}
      className={`${withGlow ? "drop-shadow-[0_0_8px_rgba(110,200,240,0.4)]" : ""} ${className ?? ""}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logo-ring" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8ddf5" />
          <stop offset="50%" stopColor="#6ec8f0" />
          <stop offset="100%" stopColor="#3a7fa5" />
        </linearGradient>
        <linearGradient id="logo-shard" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d9f4ff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#6ec8f0" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      <path d="M32 3 L61 32 L32 61 L3 32 Z" fill="none" stroke="url(#logo-ring)" strokeWidth="1.5" />
      <path d="M32 11 L53 32 L32 53 L11 32 Z" fill="#07101a" stroke="#3a7fa5" strokeWidth="1" />
      <path d="M32 17 L36 32 L32 47 L28 32 Z" fill="url(#logo-shard)" stroke="#a8ddf5" strokeWidth="0.5" />
      <path d="M32 17 L32 47" stroke="#ffffff" strokeWidth="0.5" opacity="0.6" />
      <circle cx="32" cy="3" r="1.5" fill="#a8ddf5" />
      <circle cx="61" cy="32" r="1.5" fill="#a8ddf5" />
      <circle cx="32" cy="61" r="1.5" fill="#a8ddf5" />
      <circle cx="3" cy="32" r="1.5" fill="#a8ddf5" />
    </svg>
  );
}
