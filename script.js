const STORAGE_KEY = "pepi-thoughts-v1";
const moods = ["curioso", "feliz", "calmo", "ideia", "confuso", "importante"];

let thoughts = loadThoughts();
let activeId = thoughts[0].id;

const elements = {
  thoughtCount: document.querySelector("#thoughtCount"),
  favoriteCount: document.querySelector("#favoriteCount"),
  moodCount: document.querySelector("#moodCount"),
  newTitle: document.querySelector("#newTitle"),
  newBody: document.querySelector("#newBody"),
  newMood: document.querySelector("#newMood"),
  newTag: document.querySelector("#newTag"),
  saveThought: document.querySelector("#saveThought"),
  searchThoughts: document.querySelector("#searchThoughts"),
  moodFilter: document.querySelector("#moodFilter"),
  thoughtList: document.querySelector("#thoughtList"),
  favoriteThought: document.querySelector("#favoriteThought"),
  deleteThought: document.querySelector("#deleteThought"),
  updatedAt: document.querySelector("#updatedAt"),
  editorTitle: document.querySelector("#editorTitle"),
  editorMood: document.querySelector("#editorMood"),
  editorTag: document.querySelector("#editorTag"),
  editorBody: document.querySelector("#editorBody"),
};

setupSelect(elements.newMood, moods);
setupSelect(elements.editorMood, moods);
setupSelect(elements.moodFilter, ["todos", ...moods]);

elements.saveThought.addEventListener("click", addThought);
elements.favoriteThought.addEventListener("click", toggleFavorite);
elements.deleteThought.addEventListener("click", deleteActiveThought);
elements.searchThoughts.addEventListener("input", render);
elements.moodFilter.addEventListener("change", render);

elements.editorTitle.addEventListener("input", () => updateActive("title", elements.editorTitle.value));
elements.editorMood.addEventListener("change", () => updateActive("mood", elements.editorMood.value));
elements.editorTag.addEventListener("input", () => updateActive("tag", elements.editorTag.value));
elements.editorBody.addEventListener("input", () => updateActive("body", elements.editorBody.value));

render();

function addThought() {
  const body = elements.newBody.value.trim();
  if (!body) return;

  const now = new Date().toISOString();
  const thought = {
    id: crypto.randomUUID(),
    title: elements.newTitle.value.trim() || body.split("\n")[0].slice(0, 48),
    body,
    mood: elements.newMood.value,
    tag: elements.newTag.value.trim() || "solto",
    favorite: false,
    createdAt: now,
    updatedAt: now,
  };

  thoughts = [thought, ...thoughts];
  activeId = thought.id;
  elements.newTitle.value = "";
  elements.newBody.value = "";
  elements.newMood.value = "ideia";
  elements.newTag.value = "";
  persist();
  render();
}

function updateActive(field, value) {
  thoughts = thoughts.map((thought) =>
    thought.id === activeId ? { ...thought, [field]: value, updatedAt: new Date().toISOString() } : thought,
  );
  persist();
  renderListAndStats();
}

function toggleFavorite() {
  thoughts = thoughts.map((thought) =>
    thought.id === activeId
      ? { ...thought, favorite: !thought.favorite, updatedAt: new Date().toISOString() }
      : thought,
  );
  persist();
  render();
}

function deleteActiveThought() {
  thoughts = thoughts.filter((thought) => thought.id !== activeId);
  if (thoughts.length === 0) thoughts = [createStarterThought()];
  activeId = thoughts[0].id;
  persist();
  render();
}

function render() {
  renderListAndStats();
  renderEditor();
}

function renderListAndStats() {
  const filtered = getFilteredThoughts();
  const favoriteCount = thoughts.filter((thought) => thought.favorite).length;
  const moodCount = new Set(thoughts.map((thought) => thought.mood)).size;

  elements.thoughtCount.textContent = thoughts.length;
  elements.favoriteCount.textContent = favoriteCount;
  elements.moodCount.textContent = moodCount;
  elements.thoughtList.innerHTML = "";

  filtered.forEach((thought) => {
    const button = document.createElement("button");
    button.className = `thought-item${thought.id === activeId ? " active" : ""}`;
    button.type = "button";
    button.innerHTML = `
      <span class="top-line">
        <strong>${escapeHtml(thought.title)}</strong>
        <span>${thought.favorite ? "*" : "-"}</span>
      </span>
      <span class="preview">${escapeHtml(thought.body)}</span>
      <span class="meta">${escapeHtml(thought.mood)} / ${escapeHtml(thought.tag)}</span>
    `;
    button.addEventListener("click", () => {
      activeId = thought.id;
      render();
    });
    elements.thoughtList.appendChild(button);
  });
}

function renderEditor() {
  const active = thoughts.find((thought) => thought.id === activeId) || thoughts[0];
  if (!active) return;

  elements.editorTitle.value = active.title;
  elements.editorMood.value = active.mood;
  elements.editorTag.value = active.tag;
  elements.editorBody.value = active.body;
  elements.favoriteThought.textContent = active.favorite ? "Remover favorito" : "Favoritar";
  elements.updatedAt.textContent = `Atualizado ${formatDate(active.updatedAt)}`;
}

function getFilteredThoughts() {
  const query = elements.searchThoughts.value.trim().toLowerCase();
  const mood = elements.moodFilter.value;

  return thoughts
    .filter((thought) => {
      const matchesMood = mood === "todos" || thought.mood === mood;
      const text = `${thought.title} ${thought.body} ${thought.tag}`.toLowerCase();
      return matchesMood && (!query || text.includes(query));
    })
    .sort((a, b) => Number(b.favorite) - Number(a.favorite) || b.updatedAt.localeCompare(a.updatedAt));
}

function setupSelect(select, options) {
  select.innerHTML = options.map((option) => `<option value="${option}">${option}</option>`).join("");
  if (options.includes("ideia")) select.value = "ideia";
}

function loadThoughts() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  return [createStarterThought()];
}

function createStarterThought() {
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

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(thoughts));
}

function formatDate(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
