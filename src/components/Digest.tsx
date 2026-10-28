import { cn } from "../util";
import { Copy } from "./icons";

interface Props {
  decisionCount: number;
  actionCount: number;
  owedCount: number;
  readMinutes: number;
  recordedLabel: string;
  mineOnly: boolean;
  onToggleOwed: () => void;
  onCopyDigest: () => void;
}

export function Digest({
  decisionCount, actionCount, owedCount, readMinutes, recordedLabel,
  mineOnly, onToggleOwed, onCopyDigest,
}: Props) {
  return (
    <div className="digest" aria-label="Meeting at a glance">
      {owedCount > 0 && (
        <button
          className={cn("digest-owed tnum")}
          aria-pressed={mineOnly}
          onClick={onToggleOwed}
          title="Show only the action items assigned to you"
        >
          {owedCount} owed by you
        </button>
      )}
      <span className="digest-stat tnum"><b>{decisionCount}</b> decisions</span>
      <span className="digest-stat tnum"><b>{actionCount}</b> action items</span>
      <span className="digest-sep" aria-hidden="true" />
      <span className="digest-read tnum">{readMinutes} min read · {recordedLabel}</span>
      <span className="digest-spacer" />
      <button className="mini-btn" onClick={onCopyDigest}><Copy /> Copy digest</button>
    </div>
  );
}
