import { useEffect, useRef } from "react";

interface Props {
  onClose: () => void;
}

const ROWS: Array<[string, string]> = [
  ["Play / pause", "Space"],
  ["Previous / next timestamp", "[  /  ]"],
  ["Move between action items", "j  /  k"],
  ["Toggle action item done", "x"],
  ["Toggle this help", "?"],
];

export function ShortcutsOverlay({ onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Move focus into the dialog on open, restore it on close, and keep Tab
  // inside (the card has no focusables, so Tab stays on the card itself).
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    cardRef.current?.focus();
    return () => prev?.focus?.();
  }, []);

  return (
    <div className="overlay" onClick={onClose}>
      <div
        ref={cardRef}
        className="overlay-card"
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Tab") e.preventDefault(); // keep focus trapped on the card
          if (e.key === "Escape") onClose();
        }}
      >
        <h2>Keyboard shortcuts</h2>
        {ROWS.map(([label, keys]) => (
          <div className="kb-row" key={label}>
            <span>{label}</span>
            <kbd>{keys}</kbd>
          </div>
        ))}
      </div>
    </div>
  );
}
