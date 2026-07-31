import type { Mood, Thought, ThoughtDraft } from "./types";

export const moods: Mood[] = ["curioso", "feliz", "calmo", "ideia", "confuso", "importante"];

export const emptyDraft: ThoughtDraft = {
  title: "",
  body: "",
  mood: "ideia",
  tag: "",
};

export function createStarterThought(): Thought {
  const now = new Date().toISOString();

  return {
    id: "welcome",
    title: "Meu primeiro pensamento",
    body: "Esse app e meu lugar para guardar ideias, perguntas, sonhos, planos e tudo que passar pela minha cabeca.",
    mood: "ideia",
    tag: "inicio",
    favorite: true,
    createdAt: now,
    updatedAt: now,
  };
}

export function createThought(draft: ThoughtDraft): Thought | null {
  const body = draft.body.trim();
  if (!body) return null;

  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    title: draft.title.trim() || firstLine(body),
    body,
    mood: draft.mood,
    tag: draft.tag.trim() || "solto",
    favorite: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function filterThoughts(thoughts: Thought[], query: string, moodFilter: string) {
  const normalized = query.trim().toLowerCase();

  return thoughts
    .filter((thought) => {
      const matchesMood = moodFilter === "todos" || thought.mood === moodFilter;
      const searchable = `${thought.title} ${thought.body} ${thought.tag}`.toLowerCase();

      return matchesMood && (!normalized || searchable.includes(normalized));
    })
    .sort((a, b) => Number(b.favorite) - Number(a.favorite) || b.updatedAt.localeCompare(a.updatedAt));
}

export function formatThoughtDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function firstLine(text: string) {
  return text.split(/\n/)[0].slice(0, 48);
}
