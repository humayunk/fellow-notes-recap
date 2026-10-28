// Loading state. Mirrors the final card shapes — and crucially the DOCUMENT,
// not a video — so what's visibly arriving is the notes. Zero layout shift.
export function Skeleton() {
  return (
    <>
      <div className="ribbon-wrap">
        <div className="ribbon-inner">
          <div className="ribbon shimmer" style={{ border: "1px solid var(--border)" }} />
        </div>
      </div>
      <div className="doc" aria-busy="true" aria-label="Loading recap">
        <div className="sk shimmer" style={{ height: 58 }} />
        <div className="sk shimmer" style={{ height: 120 }} />
        <div className="sk shimmer" style={{ height: 160 }} />
        <div className="sk shimmer" style={{ height: 220 }} />
      </div>
    </>
  );
}
