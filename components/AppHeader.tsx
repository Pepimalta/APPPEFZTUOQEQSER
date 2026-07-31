import type { Thought } from "../lib/types";
import { StatCard } from "./StatCard";

type AppHeaderProps = {
  thoughts: Thought[];
};

export function AppHeader({ thoughts }: AppHeaderProps) {
  const favoriteCount = thoughts.filter((thought) => thought.favorite).length;
  const moodCount = new Set(thoughts.map((thought) => thought.mood)).size;

  return (
    <header className="flex flex-col gap-4 border-b border-[#d8ccb9] pb-5 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#68705d]">
          Cofre de pensamentos
        </p>
        <h1 className="mt-2 text-4xl font-black leading-tight sm:text-5xl">APPPFZTQEQSER</h1>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StatCard label="pensamentos" value={thoughts.length} />
        <StatCard label="favoritos" value={favoriteCount} />
        <StatCard label="humores" value={moodCount} />
      </div>
    </header>
  );
}
