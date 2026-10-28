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
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts" onClick={onClose}>
      <div className="overlay-card" onClick={(e) => e.stopPropagation()}>
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
