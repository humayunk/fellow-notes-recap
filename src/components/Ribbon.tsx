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

// Desaturated steps off the violet->blue ramp. Read as data, not decoration.
const SEG_TINTS = ["#4c4066", "#473f72", "#3f4a7a", "#39507e"];

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
        <div
          className={cn("ribbon", activeAny && "has-lit")}
          role="group"
          aria-label="Meeting timeline — segments are topics, amber dots are decisions, hollow dots are action items"
        >
          {topics.map((t, i) => {
            const dur = t.tEndSec - t.tStartSec;
            const lit = hoverIdx === i || litIdx === i;
            return (
              <button
                key={t.id}
                type="button"
                className={cn("seg", lit && "lit")}
                style={{ flex: `${dur} 1 20px`, background: SEG_TINTS[i % SEG_TINTS.length] }}
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

          {decisions.map((d) => (
            <span key={d.id} className="ribbon-dot decision" style={{ left: `${pct(d.tSec)}%` }} title={`Decision at ${fmtTime(d.tSec)}`} />
          ))}
          {actionItems.map((a) => (
            <span key={a.id} className="ribbon-dot action" style={{ left: `${pct(a.tSec)}%`, top: "72%" }} title={`Action item at ${fmtTime(a.tSec)}`} />
          ))}

          {/* reading-position marker (hollow) and playback head (solid) */}
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
