import { cn } from "@/lib/utils";

/**
 * Logo de Ebonhold. Diamante de Acherus con shard de Frostmourne.
 * Master vectorial unico — usado en web, launcher, favicon e iconos del instalador.
 */
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
      viewBox="0 0 256 256"
      width={size}
      height={size}
      className={cn(
        withGlow && "drop-shadow-[0_0_10px_rgba(110,200,240,0.5)]",
        className,
      )}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="lg-halo" cx="0.5" cy="0.5" r="0.55">
          <stop offset="0%" stopColor="#6ec8f0" stopOpacity="0.35" />
          <stop offset="45%" stopColor="#3a7fa5" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#6ec8f0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lg-outer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e6f6ff" />
          <stop offset="25%" stopColor="#a8ddf5" />
          <stop offset="55%" stopColor="#6ec8f0" />
          <stop offset="80%" stopColor="#3a7fa5" />
          <stop offset="100%" stopColor="#1a4060" />
        </linearGradient>
        <linearGradient id="lg-bevel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a3d56" />
          <stop offset="50%" stopColor="#0a1828" />
          <stop offset="100%" stopColor="#2a5a7a" />
        </linearGradient>
        <radialGradient id="lg-crypt" cx="0.5" cy="0.5" r="0.7">
          <stop offset="0%" stopColor="#0e1928" />
          <stop offset="60%" stopColor="#070f1a" />
          <stop offset="100%" stopColor="#02060c" />
        </radialGradient>
        <linearGradient id="lg-blade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
          <stop offset="20%" stopColor="#e6f6ff" stopOpacity="0.92" />
          <stop offset="50%" stopColor="#a8ddf5" stopOpacity="0.82" />
          <stop offset="80%" stopColor="#6ec8f0" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#3a7fa5" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="lg-facet" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3a7fa5" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#1a4060" stopOpacity="0.5" />
        </linearGradient>
        <radialGradient id="lg-core" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#d9f4ff" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#6ec8f0" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#6ec8f0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lg-cardinal" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#a8ddf5" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#6ec8f0" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="128" cy="128" r="124" fill="url(#lg-halo)" />
      <path d="M128 10 L246 128 L128 246 L10 128 Z" fill="url(#lg-outer)" />
      <path
        d="M128 22 L234 128 L128 234 L22 128 Z M128 36 L220 128 L128 220 L36 128 Z"
        fill="url(#lg-bevel)"
        fillRule="evenodd"
      />
      <path d="M128 36 L220 128 L128 220 L36 128 Z" fill="url(#lg-crypt)" />
      <path d="M128 50 L206 128 L128 206 L50 128 Z" fill="none" stroke="#3a7fa5" strokeWidth="0.6" opacity="0.45" />

      <g fill="#6ec8f0" opacity="0.7">
        <path d="M128 38 L131.5 44 L128 50 L124.5 44 Z" />
        <path d="M218 128 L212 131.5 L206 128 L212 124.5 Z" />
        <path d="M128 218 L131.5 212 L128 206 L124.5 212 Z" />
        <path d="M38 128 L44 131.5 L50 128 L44 124.5 Z" />
      </g>

      <g fill="#a8ddf5" opacity="0.7">
        <path d="M70 70 L72 76 L78 78 L72 80 L70 86 L68 80 L62 78 L68 76 Z" />
        <path d="M186 70 L188 76 L194 78 L188 80 L186 86 L184 80 L178 78 L184 76 Z" />
        <path d="M70 186 L72 180 L78 178 L72 176 L70 170 L68 176 L62 178 L68 180 Z" />
        <path d="M186 186 L188 180 L194 178 L188 176 L186 170 L184 176 L178 178 L184 180 Z" />
      </g>

      <path d="M128 56 L148 128 L128 200 L108 128 Z" fill="url(#lg-blade)" stroke="#d9f4ff" strokeWidth="0.8" />
      <path d="M128 56 L148 128 L128 200 Z" fill="url(#lg-facet)" opacity="0.4" />
      <line x1="128" y1="56" x2="128" y2="200" stroke="#ffffff" strokeWidth="0.9" opacity="0.85" />
      <line x1="128" y1="80" x2="142" y2="128" stroke="#ffffff" strokeWidth="0.4" opacity="0.4" />
      <line x1="128" y1="80" x2="114" y2="128" stroke="#ffffff" strokeWidth="0.4" opacity="0.4" />
      <line x1="128" y1="176" x2="142" y2="128" stroke="#3a7fa5" strokeWidth="0.4" opacity="0.6" />
      <line x1="128" y1="176" x2="114" y2="128" stroke="#3a7fa5" strokeWidth="0.4" opacity="0.6" />

      <circle cx="128" cy="128" r="18" fill="url(#lg-core)" />
      <circle cx="128" cy="128" r="4" fill="#ffffff" />
      <circle cx="128" cy="128" r="2" fill="#e6f6ff" />

      <circle cx="128" cy="10" r="7" fill="url(#lg-cardinal)" />
      <circle cx="246" cy="128" r="7" fill="url(#lg-cardinal)" />
      <circle cx="128" cy="246" r="7" fill="url(#lg-cardinal)" />
      <circle cx="10" cy="128" r="7" fill="url(#lg-cardinal)" />
      <circle cx="128" cy="10" r="2.5" fill="#ffffff" />
      <circle cx="246" cy="128" r="2.5" fill="#ffffff" />
      <circle cx="128" cy="246" r="2.5" fill="#ffffff" />
      <circle cx="10" cy="128" r="2.5" fill="#ffffff" />
    </svg>
  );
}
