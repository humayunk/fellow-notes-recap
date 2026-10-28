import { useState } from "react";
import type { Topic, Decision, ActionItem } from "../types";
import { fmtTime, cn, clamp } from "../util";

interface Props {
  topics: Topic[];
  decisions: Decision[];
  actionItems: ActionItem[];
  durationSec: number;
  currentSec: number;
  readingSec: number;
  playing: boolean;
  litSec: number | null; // seconds to light (from chip hover)
  onJumpTopic: (topicId: string) => void;
}

export function Ribbon({
  topics, decisions, actionItems, durationSec,
  currentSec, readingSec, playing, litSec, onJumpTopic,
}: Props) {
  const [tip, setTip] = useState<{ title: string; range: string; xPct: number } | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const pct = (sec: number) => clamp((sec / durationSec) * 100, 0, 100);

  const litIdx = litSec == null ? null
    : topics.findIndex((t) => litSec >= t.tStartSec && litSec < t.tEndSec);
  const activeAny = hoverIdx != null || (litIdx != null && litIdx >= 0);

  return (
    <div className="ribbon-wrap">
      <div className="ribbon-inner">
        {/* .ribbon is overflow-visible so marker caps + the tooltip aren't
            clipped; only .ribbon-track clips the rounded segment fills. */}
        <div
          className={cn("ribbon", activeAny && "has-lit")}
          role="group"
          aria-label="Meeting timeline — a visual summary of the topics, decisions, and action items listed below"
        >
          <div className="ribbon-track">
            {topics.map((t, i) => {
              const dur = t.tEndSec - t.tStartSec;
              const lit = hoverIdx === i || litIdx === i;
              return (
                <button
                  key={t.id}
                  type="button"
                  className={cn("seg", lit && "lit")}
                  style={{ flex: `${dur} 1 0`, background: `var(--seg-${i % 4})` }}
                  aria-label={`${t.title}, ${fmtTime(t.tStartSec)} to ${fmtTime(t.tEndSec)}`}
                  onMouseEnter={(e) => {
                    setHoverIdx(i);
                    const r = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
                    const sr = e.currentTarget.getBoundingClientRect();
                    setTip({
                      title: t.title,
                      range: `${fmtTime(t.tStartSec)}–${fmtTime(t.tEndSec)}`,
                      xPct: ((sr.left + sr.width / 2 - r.left) / r.width) * 100,
                    });
                  }}
                  onMouseLeave={() => { setHoverIdx(null); setTip(null); }}
                  onClick={() => onJumpTopic(t.id)}
                >
                  {dur / durationSec > 0.08 && <span className="seg-label">{t.title}</span>}
                </button>
              );
            })}
          </div>

          {/* decorative markers — the Decisions / Action-items lists below are
              the accessible source of truth, so these are aria-hidden. */}
          {decisions.map((d) => (
            <span key={d.id} className="ribbon-dot decision" style={{ left: `${pct(d.tSec)}%` }} title={`Decision at ${fmtTime(d.tSec)}`} aria-hidden="true" />
          ))}
          {actionItems.map((a) => (
            <span key={a.id} className="ribbon-dot action" style={{ left: `${pct(a.tSec)}%`, top: "72%" }} title={`Action item at ${fmtTime(a.tSec)}`} aria-hidden="true" />
          ))}

          <span className="readhead" style={{ left: `${pct(readingSec)}%` }} aria-hidden="true" />
          {(playing || currentSec > 0) && (
            <span className="playhead" style={{ left: `${pct(currentSec)}%` }} aria-hidden="true" />
          )}

          {tip && (
            <div className="ribbon-tip" style={{ left: `${tip.xPct}%` }}>
              {tip.title}<span className="tip-time tnum">{tip.range}</span>
            </div>
          )}
        </div>

        <div className="ribbon-legend">
          <span><span className="lg-bar" /> Playing {playing ? fmtTime(currentSec) : ""}</span>
          <span><span className="lg-bar read" /> Reading</span>
          <span><span className="lg-dot amber" /> Decision</span>
          <span><span className="lg-dot action" /> Action item</span>
        </div>
      </div>
    </div>
  );
}
