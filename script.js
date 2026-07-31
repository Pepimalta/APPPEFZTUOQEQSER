const STORAGE_KEY = "pepi-thoughts-v1";
const moods = ["curioso", "feliz", "calmo", "ideia", "confuso", "importante"];
const modules = {
  jornal: {
    name: "Jornal",
    emoji: "🎉",
    description: "Registre o que aconteceu, o que voce viu e o que merece virar noticia.",
  },
  loucuras: {
    name: "Pensamentos loucos e idiotas",
    emoji: "🧠",
    description: "Ideias sem filtro, teorias tortas e frases que nasceram gritando.",
  },
  coisas: {
    name: "Coisas",
    emoji: "💼",
    description: "Listas, achados, planos, links, lembretes e baguncinhas uteis.",
  },
  putisse: {
    name: "Diario de putisse",
    emoji: "💋",
    description: "O lugar das opinioes afiadas, dramas, venenos e verdades sinceras.",
  },
  felicidade: {
    name: "Felicidade",
    emoji: "☀",
    description: "Guarde coisas boas para revisitar quando o mundo estiver meio torto.",
  },
};

let thoughts = loadThoughts();
let activeId = thoughts[0].id;
let activeModule = "jornal";

const elements = {
  thoughtCount: document.querySelector("#thoughtCount"),
  favoriteCount: document.querySelector("#favoriteCount"),
  moodCount: document.querySelector("#moodCount"),
  newTitle: document.querySelector("#newTitle"),
  newBody: document.querySelector("#newBody"),
  newModule: document.querySelector("#newModule"),
  newMood: document.querySelector("#newMood"),
  newTag: document.querySelector("#newTag"),
  currentModuleName: document.querySelector("#currentModuleName"),
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
  menuCards: document.querySelectorAll(".feature-card"),
  moduleButtons: document.querySelectorAll("[data-module]"),
  saveToast: document.querySelector("#saveToast"),
  homeView: document.querySelector("#homeView"),
  moduleView: document.querySelector("#moduleView"),
  backHome: document.querySelector("#backHome"),
  moduleEmoji: document.querySelector("#moduleEmoji"),
  moduleTitle: document.querySelector("#moduleTitle"),
  moduleDescription: document.querySelector("#moduleDescription"),
  moduleSummary: document.querySelector("#moduleSummary"),
};

let toastTimer;

setupSelect(elements.newMood, moods);
setupSelect(elements.editorMood, moods);
setupSelect(elements.moodFilter, ["todos", ...moods]);
elements.moodFilter.value = "todos";
setupModuleSelect();

elements.saveThought.addEventListener("click", addThought);
elements.favoriteThought.addEventListener("click", toggleFavorite);
elements.deleteThought.addEventListener("click", deleteActiveThought);
elements.searchThoughts.addEventListener("input", render);
elements.moodFilter.addEventListener("change", render);

elements.editorTitle.addEventListener("input", () => updateActive("title", elements.editorTitle.value));
elements.editorMood.addEventListener("change", () => updateActive("mood", elements.editorMood.value));
elements.editorTag.addEventListener("input", () => updateActive("tag", elements.editorTag.value));
elements.editorBody.addEventListener("input", () => updateActive("body", elements.editorBody.value));
elements.newModule.addEventListener("change", () => setActiveModule(elements.newModule.value, false));
elements.moduleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveModule(button.dataset.module, true);
  });
});
elements.backHome.addEventListener("click", showHome);

render();

function addThought() {
  const body = elements.newBody.value.trim();
  if (!body) return;

  activeModule = elements.newModule.value || activeModule;
  const now = new Date().toISOString();
  const thought = {
    id: crypto.randomUUID(),
    title: elements.newTitle.value.trim() || body.split("\n")[0].slice(0, 48),
    body,
    module: activeModule,
    mood: elements.newMood.value,
    tag: elements.newTag.value.trim() || "solto",
    favorite: false,
    createdAt: now,
    updatedAt: now,
  };

  thoughts = [thought, ...thoughts];
  activeId = thought.id;
  elements.searchThoughts.value = "";
  elements.moodFilter.value = "todos";
  elements.newTitle.value = "";
  elements.newBody.value = "";
  elements.newMood.value = "ideia";
  elements.newTag.value = "";
  persist();
  render();
  showSaveToast();
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
  renderModulePage();
  renderListAndStats();
  renderEditor();
}

function renderModulePage() {
  const module = modules[activeModule];
  const moduleCount = thoughts.filter((thought) => getThoughtModule(thought) === activeModule).length;

  elements.menuCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.module === activeModule);
  });

  elements.moduleEmoji.textContent = module.emoji;
  elements.moduleTitle.textContent = module.name;
  elements.moduleDescription.textContent = module.description;
  elements.currentModuleName.value = module.name;
  elements.newModule.value = activeModule;
  elements.moduleSummary.textContent = `${moduleCount} guardado${moduleCount === 1 ? "" : "s"} nesta pagina`;
}

function renderListAndStats() {
  const filtered = getFilteredThoughts();
  const favoriteCount = thoughts.filter((thought) => thought.favorite).length;
  const moodCount = new Set(thoughts.map((thought) => thought.mood)).size;
  const moduleCount = thoughts.filter((thought) => getThoughtModule(thought) === activeModule).length;

  elements.thoughtCount.textContent = `${thoughts.length} pensamentos`;
  elements.favoriteCount.textContent = `${favoriteCount} favoritos`;
  elements.moodCount.textContent = `${moodCount} humores`;
  elements.thoughtList.innerHTML = "";

  if (filtered.length === 0) {
    elements.thoughtList.innerHTML = `<div class="empty-state">${
      moduleCount === 0
        ? "Nada guardado nesta pagina ainda."
        : "Tem coisa guardada aqui, mas o filtro atual escondeu."
    }</div>`;
    return;
  }

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
  const active = thoughts.find((thought) => thought.id === activeId && getThoughtModule(thought) === activeModule);
  if (!active) {
    elements.editorTitle.value = "";
    elements.editorMood.value = "ideia";
    elements.editorTag.value = "";
    elements.editorBody.value = "";
    elements.editorTitle.placeholder = "Nenhum pensamento nessa pagina ainda";
    elements.editorBody.placeholder = "Guarda um pensamento neste modulo para ele aparecer aqui.";
    elements.favoriteThought.disabled = true;
    elements.deleteThought.disabled = true;
    elements.updatedAt.textContent = "Pagina vazia";
    return;
  }

  elements.editorTitle.value = active.title;
  elements.editorMood.value = active.mood;
  elements.editorTag.value = active.tag;
  elements.editorBody.value = active.body;
  elements.editorTitle.placeholder = "";
  elements.editorBody.placeholder = "";
  elements.favoriteThought.disabled = false;
  elements.deleteThought.disabled = false;
  elements.favoriteThought.textContent = active.favorite ? "Remover favorito" : "Favoritar";
  elements.updatedAt.textContent = `Atualizado ${formatDate(active.updatedAt)}`;
}

function getFilteredThoughts() {
  const query = elements.searchThoughts.value.trim().toLowerCase();
  const mood = elements.moodFilter.value;

  return thoughts
    .filter((thought) => {
      const matchesModule = getThoughtModule(thought) === activeModule;
      const matchesMood = mood === "todos" || thought.mood === mood;
      const text = `${thought.title} ${thought.body} ${thought.tag}`.toLowerCase();
      return matchesModule && matchesMood && (!query || text.includes(query));
    })
    .sort((a, b) => Number(b.favorite) - Number(a.favorite) || b.updatedAt.localeCompare(a.updatedAt));
}

function setupSelect(select, options) {
  select.innerHTML = options.map((option) => `<option value="${option}">${option}</option>`).join("");
  if (options.includes("ideia")) select.value = "ideia";
}

function setupModuleSelect() {
  elements.newModule.innerHTML = Object.entries(modules)
    .map(([key, module]) => `<option value="${key}">${module.name}</option>`)
    .join("");
  elements.newModule.value = activeModule;
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
    module: "jornal",
    mood: "ideia",
    tag: "inicio",
    favorite: true,
    createdAt: now,
    updatedAt: now,
  };
}

function setActiveModule(moduleKey, openPage = true) {
  if (!modules[moduleKey]) return;

  activeModule = moduleKey;
  const firstInModule = thoughts.find((thought) => getThoughtModule(thought) === activeModule);
  activeId = firstInModule?.id || "";
  if (openPage) showModule();
  render();
}

function getThoughtModule(thought) {
  return modules[thought.module] ? thought.module : "jornal";
}

function showModule() {
  elements.homeView.classList.add("hidden");
  elements.moduleView.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showHome() {
  elements.moduleView.classList.add("hidden");
  elements.homeView.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(thoughts));
  } catch {
    showSaveToast("Nao consegui salvar no navegador.");
  }
}

function showSaveToast(message = "Pensamento guardado.") {
  clearTimeout(toastTimer);
  elements.saveToast.textContent = message;
  elements.saveToast.classList.add("visible");

  toastTimer = setTimeout(() => {
    elements.saveToast.classList.remove("visible");
  }, 2200);
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
