// Inline SVG icons, currentColor-driven so they theme automatically.

export const Play = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
    <path d="M2 1.2v7.6L8.5 5z" />
  </svg>
);

export const Pause = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
    <rect x="1.8" y="1.5" width="2.2" height="7" rx="0.6" />
    <rect x="6" y="1.5" width="2.2" height="7" rx="0.6" />
  </svg>
);

export const Check = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M2.5 6.2 5 8.6l4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Chevron = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Spark = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 1l1.3 3.7L13 6l-3.7 1.3L8 11 6.7 7.3 3 6l3.7-1.3z" />
    <path d="M13 10l.6 1.6L15 12l-1.4.4L13 14l-.6-1.6L11 12l1.4-.4z" />
  </svg>
);

export const Gavel = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3.5 6.5 7 3m0 0 2 2M7 3 5 1M9 5l2 2M9 5 7 7m2-2 1.5 1.5M2 12h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Copy = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <rect x="4.2" y="4.2" width="7" height="7" rx="1.4" stroke="currentColor" strokeWidth="1.3" />
    <path d="M9.3 2.8H3.4c-.6 0-1.1.5-1.1 1.1v5.9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const Film = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="2" y="3.5" width="12" height="9" rx="1.6" stroke="currentColor" strokeWidth="1.3" />
    <path d="M6.5 6.2v3.6L9.6 8z" fill="currentColor" />
  </svg>
);

export const Send = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M12.5 1.5 6 8M12.5 1.5 8.5 12.5l-2.5-4.5L1.5 5.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
