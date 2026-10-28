// Data model for the notes-first recap. One meeting, fully local.

export interface Attendee {
  id: string;
  name: string;
  initials: string;
  color: string; // avatar background
  speakingSec: number;
}

export interface SummarySentence {
  id: string;
  text: string;
  tSec: number; // moment this sentence maps to
}

export interface Decision {
  id: string;
  text: string;
  tSec: number;
  decidedBy: string; // attendee id
}

export type PushState = "local" | "pushed";

export interface ActionItem {
  id: string;
  text: string;
  assigneeId: string;
  dueDate: string | null; // ISO date
  tSec: number;
  pushState: PushState;
  pushedTo: "Jira" | "Slack" | null;
  done: boolean;
}

export interface TopicBullet {
  id: string;
  text: string;
  tSec: number;
}

export interface Topic {
  id: string;
  title: string;
  tStartSec: number;
  tEndSec: number;
  bullets: TopicBullet[];
}

export interface TranscriptCue {
  tStartSec: number;
  tEndSec: number;
  speakerId: string;
  text: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string; // ISO
  durationSec: number;
  readMinutes: number;
  currentViewerId: string;
  attendees: Attendee[];
  summary: { sentences: SummarySentence[] };
  decisions: Decision[];
  actionItems: ActionItem[];
  topics: Topic[];
  transcript: TranscriptCue[];
}
