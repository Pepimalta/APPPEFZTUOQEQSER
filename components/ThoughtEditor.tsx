import { formatThoughtDate, moods } from "../lib/thoughts";
import type { Mood, Thought } from "../lib/types";

type ThoughtEditorProps = {
  thought?: Thought;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onUpdate: (field: "title" | "body" | "mood" | "tag", value: string) => void;
};

export function ThoughtEditor({ thought, onDelete, onToggleFavorite, onUpdate }: ThoughtEditorProps) {
  if (!thought) {
    return (
      <section className="rounded-lg border border-[#cfc1ab] bg-[#fffdf7] p-4 shadow-sm sm:p-6">
        <div className="grid h-full min-h-80 place-items-center text-[#6a6258]">
          Escreve um pensamento para comecar.
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-[#cfc1ab] bg-[#fffdf7] p-4 shadow-sm sm:p-6">
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-col gap-3 border-b border-[#e1d7c7] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <button className="secondary-button" onClick={() => onToggleFavorite(thought.id)}>
              {thought.favorite ? "Remover favorito" : "Favoritar"}
            </button>
            <button className="danger-button" onClick={() => onDelete(thought.id)}>
              Apagar
            </button>
          </div>
          <p className="text-sm text-[#6a6258]">Atualizado {formatThoughtDate(thought.updatedAt)}</p>
        </div>

        <input
          aria-label="Editar titulo"
          className="editor-title"
          value={thought.title}
          onChange={(event) => onUpdate("title", event.target.value)}
        />
        <div className="grid gap-2 sm:grid-cols-2">
          <select
            aria-label="Editar sentimento"
            className="field"
            value={thought.mood}
            onChange={(event) => onUpdate("mood", event.target.value as Mood)}
          >
            {moods.map((mood) => (
              <option key={mood}>{mood}</option>
            ))}
          </select>
          <input
            aria-label="Editar tag"
            className="field"
            value={thought.tag}
            onChange={(event) => onUpdate("tag", event.target.value)}
          />
        </div>
        <textarea
          aria-label="Editar pensamento"
          className="editor-body"
          value={thought.body}
          onChange={(event) => onUpdate("body", event.target.value)}
        />
      </div>
    </section>
  );
}
