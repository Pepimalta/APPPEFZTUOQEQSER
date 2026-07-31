import { moods } from "../lib/thoughts";
import type { Thought } from "../lib/types";

type ThoughtListProps = {
  activeId?: string;
  moodFilter: string;
  query: string;
  thoughts: Thought[];
  onMoodFilterChange: (mood: string) => void;
  onQueryChange: (query: string) => void;
  onSelectThought: (id: string) => void;
};

export function ThoughtList({
  activeId,
  moodFilter,
  query,
  thoughts,
  onMoodFilterChange,
  onQueryChange,
  onSelectThought,
}: ThoughtListProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col rounded-lg border border-[#d8ccb9] bg-[#fffaf0] p-4 shadow-sm">
      <div className="grid gap-2">
        <input
          aria-label="Buscar pensamentos"
          className="field"
          placeholder="Buscar"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        <select
          aria-label="Filtrar por sentimento"
          className="field"
          value={moodFilter}
          onChange={(event) => onMoodFilterChange(event.target.value)}
        >
          <option value="todos">todos</option>
          {moods.map((mood) => (
            <option key={mood}>{mood}</option>
          ))}
        </select>
      </div>

      <div className="mt-3 grid gap-2 overflow-auto pr-1">
        {thoughts.map((thought) => (
          <button
            key={thought.id}
            className={`thought-item ${thought.id === activeId ? "thought-item-active" : ""}`}
            onClick={() => onSelectThought(thought.id)}
          >
            <span className="flex items-center justify-between gap-2">
              <strong className="truncate">{thought.title}</strong>
              <span aria-label={thought.favorite ? "favorito" : "nao favorito"}>
                {thought.favorite ? "*" : "-"}
              </span>
            </span>
            <span className="line-clamp-2 text-left text-sm text-[#6a6258]">{thought.body}</span>
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#7b5f3f]">
              {thought.mood} / {thought.tag}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
