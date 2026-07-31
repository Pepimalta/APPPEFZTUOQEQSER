export type Mood = "curioso" | "feliz" | "calmo" | "ideia" | "confuso" | "importante";

export type Thought = {
  id: string;
  title: string;
  body: string;
  mood: Mood;
  tag: string;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ThoughtDraft = {
  title: string;
  body: string;
  mood: Mood;
  tag: string;
};
