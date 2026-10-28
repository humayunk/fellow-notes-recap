import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ---------- theme ---------- */
export type Theme = "system" | "light" | "dark";
const THEME_KEY = "fellow-recap:theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem(THEME_KEY) as Theme) || "system";
    } catch {
      return "system";
    }
  });
  useEffect(() => {
    const el = document.documentElement;
    if (theme === "system") el.removeAttribute("data-theme");
    else el.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* storage blocked — theme still applies for the session */
    }
  }, [theme]);
  return { theme, setTheme };
}

/* ---------- reduced motion ---------- */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return false;
    }
  });
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

/* ---------- simulated playback clock ----------
   No real video asset: a timer advances currentSec while playing, so the
   ribbon head and live caption are driven exactly as a real player would. */
export interface Playback {
  currentSec: number;
  playing: boolean;
  open: boolean;
  rate: number;
  playFrom: (sec: number) => void;
  toggle: () => void;
  seek: (sec: number) => void;
  step: (dir: 1 | -1, stops: number[]) => void;
  setRate: (r: number) => void;
  close: () => void;
}

export function usePlayback(durationSec: number): Playback {
  const [currentSec, setCurrentSec] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [open, setOpen] = useState(false);
  const [rate, setRate] = useState(1);
  const last = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) {
      last.current = null;
      return;
    }
    let raf = 0;
    const tick = (ts: number) => {
      if (last.current == null) last.current = ts;
      const dt = (ts - last.current) / 1000;
      last.current = ts;
      setCurrentSec((c) => {
        const next = c + dt * rate;
        if (next >= durationSec) {
          setPlaying(false);
          return durationSec;
        }
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, rate, durationSec]);

  const playFrom = useCallback((sec: number) => {
    setCurrentSec(sec);
    setOpen(true);
    setPlaying(true);
  }, []);
  const toggle = useCallback(() => {
    setOpen(true);
    setPlaying((p) => !p);
  }, []);
  const seek = useCallback((sec: number) => setCurrentSec(Math.max(0, Math.min(durationSec, sec))), [durationSec]);
  const step = useCallback((dir: 1 | -1, stops: number[]) => {
    setCurrentSec((c) => {
      const sorted = [...stops].sort((a, b) => a - b);
      if (dir === 1) return sorted.find((s) => s > c + 0.5) ?? c;
      return [...sorted].reverse().find((s) => s < c - 0.5) ?? c;
    });
    setOpen(true);
  }, []);
  const close = useCallback(() => {
    setPlaying(false);
    setOpen(false);
  }, []);

  return { currentSec, playing, open, rate, playFrom, toggle, seek, step, setRate, close };
}

/* ---------- action-item triage, persisted ---------- */
const TRIAGE_KEY = "fellow-recap:triage";

export function useTriage(ids: string[]) {
  const [done, setDone] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem(TRIAGE_KEY) || "{}");
    } catch {
      return {};
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(TRIAGE_KEY, JSON.stringify(done));
    } catch {
      /* storage blocked — triage still works for the session */
    }
  }, [done]);
  const toggle = useCallback((id: string) => setDone((d) => ({ ...d, [id]: !d[id] })), []);
  const reset = useCallback(() => setDone({}), []);
  const doneCount = useMemo(() => ids.filter((id) => done[id]).length, [ids, done]);
  return { done, toggle, reset, doneCount };
}

/* ---------- reading-position scroll-spy ----------
   Scans [data-tsec] anchors for the one nearest a reading line near the top
   of the viewport, returns its seconds. Drives the hollow ribbon marker. */
export function useReadingPosition(active: boolean): number {
  const [readingSec, setReadingSec] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const compute = () => {
      raf = 0;
      // Reading line sits ~30% down the viewport. The document isn't strictly
      // chronological (summary spans the whole meeting, topics re-cover it), so
      // we track the FURTHEST-along moment read — the max tSec among anchors
      // scrolled above the line. Monotonic as you scroll down: never jumps back.
      const line = window.innerHeight * 0.3;
      const anchors = Array.from(document.querySelectorAll<HTMLElement>("[data-tsec]"));
      let chosen = 0;
      for (const el of anchors) {
        if (el.getBoundingClientRect().top <= line) {
          chosen = Math.max(chosen, Number(el.dataset.tsec));
        }
      }
      setReadingSec(chosen);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [active]);
  return readingSec;
}
