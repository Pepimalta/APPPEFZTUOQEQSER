"use client";

import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "./components/AppHeader";
import { NewThoughtForm } from "./components/NewThoughtForm";
import { ThoughtEditor } from "./components/ThoughtEditor";
import { ThoughtList } from "./components/ThoughtList";
import { loadThoughts, saveThoughts } from "./lib/storage";
import { createStarterThought, createThought, emptyDraft, filterThoughts } from "./lib/thoughts";
import type { Thought, ThoughtDraft } from "./lib/types";

const starterThought = createStarterThought();

export default function Home() {
  const [thoughts, setThoughts] = useState<Thought[]>([starterThought]);
  const [activeId, setActiveId] = useState(starterThought.id);
  const [query, setQuery] = useState("");
  const [moodFilter, setMoodFilter] = useState("todos");
  const [draft, setDraft] = useState<ThoughtDraft>(emptyDraft);

  useEffect(() => {
    const savedThoughts = loadThoughts();

    if (savedThoughts) {
      setThoughts(savedThoughts);
      setActiveId(savedThoughts[0].id);
    }
  }, []);

  useEffect(() => {
    saveThoughts(thoughts);
  }, [thoughts]);

  const filteredThoughts = useMemo(
    () => filterThoughts(thoughts, query, moodFilter),
    [thoughts, query, moodFilter],
  );

  const activeThought =
    thoughts.find((thought) => thought.id === activeId) ?? filteredThoughts[0] ?? thoughts[0];

  function handleSaveThought() {
    const nextThought = createThought(draft);
    if (!nextThought) return;

    setThoughts((current) => [nextThought, ...current]);
    setActiveId(nextThought.id);
    setDraft(emptyDraft);
  }

  function handleUpdateActive(field: "title" | "body" | "mood" | "tag", value: string) {
    if (!activeThought) return;

    setThoughts((current) =>
      current.map((thought) =>
        thought.id === activeThought.id
          ? { ...thought, [field]: value, updatedAt: new Date().toISOString() }
          : thought,
      ),
    );
  }

  function handleToggleFavorite(id: string) {
    setThoughts((current) =>
      current.map((thought) =>
        thought.id === id
          ? { ...thought, favorite: !thought.favorite, updatedAt: new Date().toISOString() }
          : thought,
      ),
    );
  }

  function handleDeleteThought(id: string) {
    setThoughts((current) => {
      const remaining = current.filter((thought) => thought.id !== id);
      const nextThoughts = remaining.length ? remaining : [createStarterThought()];

      setActiveId(nextThoughts[0].id);
      return nextThoughts;
    });
  }

  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#211d1a]">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <AppHeader thoughts={thoughts} />

        <div className="grid flex-1 gap-5 lg:grid-cols-[380px_1fr]">
          <aside className="flex min-h-0 flex-col gap-4">
            <NewThoughtForm draft={draft} onDraftChange={setDraft} onSave={handleSaveThought} />
            <ThoughtList
              activeId={activeThought?.id}
              moodFilter={moodFilter}
              query={query}
              thoughts={filteredThoughts}
              onMoodFilterChange={setMoodFilter}
              onQueryChange={setQuery}
              onSelectThought={setActiveId}
            />
          </aside>

          <ThoughtEditor
            thought={activeThought}
            onDelete={handleDeleteThought}
            onToggleFavorite={handleToggleFavorite}
            onUpdate={handleUpdateActive}
          />
        </div>
      </section>
    </main>
  );
}
