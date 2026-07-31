import { moods } from "../lib/thoughts";
import type { ThoughtDraft } from "../lib/types";

type NewThoughtFormProps = {
  draft: ThoughtDraft;
  onDraftChange: (draft: ThoughtDraft) => void;
  onSave: () => void;
};

export function NewThoughtForm({ draft, onDraftChange, onSave }: NewThoughtFormProps) {
  return (
    <section className="rounded-lg border border-[#d8ccb9] bg-[#fffaf0] p-4 shadow-sm">
      <h2 className="text-lg font-bold">Novo pensamento</h2>
      <div className="mt-3 grid gap-3">
        <input
          aria-label="Titulo do pensamento"
          className="field"
          placeholder="Titulo"
          value={draft.title}
          onChange={(event) => onDraftChange({ ...draft, title: event.target.value })}
        />
        <textarea
          aria-label="Texto do pensamento"
          className="field min-h-32 resize-none"
          placeholder="Escreve aqui tudo que voce esta pensando..."
          value={draft.body}
          onChange={(event) => onDraftChange({ ...draft, body: event.target.value })}
        />
        <div className="grid grid-cols-2 gap-2">
          <select
            aria-label="Sentimento"
            className="field"
            value={draft.mood}
            onChange={(event) => onDraftChange({ ...draft, mood: event.target.value as ThoughtDraft["mood"] })}
          >
            {moods.map((mood) => (
              <option key={mood}>{mood}</option>
            ))}
          </select>
          <input
            aria-label="Tag"
            className="field"
            placeholder="tag"
            value={draft.tag}
            onChange={(event) => onDraftChange({ ...draft, tag: event.target.value })}
          />
        </div>
        <button className="primary-button" onClick={onSave}>
          Guardar pensamento
        </button>
      </div>
    </section>
  );
}
