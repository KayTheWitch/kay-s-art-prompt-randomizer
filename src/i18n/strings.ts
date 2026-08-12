import type { Lang } from "@/data/categories";

export const strings = {
  brand: { pt: "Risco Solto", en: "Risco Solto" },
  saved: { pt: "Salvos", en: "Saved" },
  language: { pt: "Idioma", en: "Language" },
  // home
  homeKicker: { pt: "Prompts para desenhar hoje", en: "Prompts to draw today" },
  homeTitle: {
    pt: "Escolha uma temática e deixe o sorteio decidir o resto.",
    en: "Pick a theme and let the shuffle decide the rest.",
  },
  homeDescription: {
    pt: "Sorteie temas de desenho por área: personagens, cenários, objetos e exercícios de estudo. Para artistas de arte tradicional e digital.",
    en: "Shuffle drawing themes by area: characters, scenes, objects and study exercises. For traditional and digital artists.",
  },
  drawAnyArea: { pt: "Sortear de qualquer área", en: "Shuffle from any area" },
  draw: { pt: "Sortear", en: "Shuffle" },
  // studio
  drawEverything: { pt: "Sortear tudo", en: "Shuffle everything" },
  favorite: { pt: "Favoritar", en: "Favorite" },
  favorited: { pt: "Favoritado", en: "Favorited" },
  copy: { pt: "Copiar", en: "Copy" },
  link: { pt: "Link", en: "Link" },
  reroll: { pt: "Re-sortear", en: "Reroll" },
  promptCopied: { pt: "Prompt copiado", en: "Prompt copied" },
  linkCopied: { pt: "Link copiado", en: "Link copied" },
  copyFailed: { pt: "Não consegui copiar aqui", en: "Couldn't copy here" },
  savedToFavorites: { pt: "Salvo nos favoritos", en: "Saved to favorites" },
  removedFromFavorites: { pt: "Removido dos favoritos", en: "Removed from favorites" },
  // timer
  sketchTimer: { pt: "Timer de sketch", en: "Sketch timer" },
  start: { pt: "Começar", en: "Start" },
  pause: { pt: "Pausar", en: "Pause" },
  reset: { pt: "Zerar", en: "Reset" },
  timeUp: { pt: "Tempo esgotado", en: "Time's up" },
  timeUpHint: {
    pt: "Solte o lápis e olhe o desenho de longe.",
    en: "Put the pencil down and look at the drawing from afar.",
  },
  min: { pt: "min", en: "min" },
  // saved page
  savedTitle: { pt: "Salvos", en: "Saved" },
  savedSubtitle: {
    pt: "Tudo fica guardado apenas neste navegador, sem cadastro.",
    en: "Everything is stored in this browser only, no account needed.",
  },
  favorites: { pt: "Favoritos", en: "Favorites" },
  history: { pt: "Histórico", en: "History" },
  noFavorites: {
    pt: "Nenhum favorito ainda. Sorteie e clique em Favoritar.",
    en: "No favorites yet. Shuffle one and hit Favorite.",
  },
  noHistory: {
    pt: "Seus últimos sorteios aparecem aqui.",
    en: "Your latest shuffles show up here.",
  },
  clearHistory: { pt: "Limpar histórico", en: "Clear history" },
  loading: { pt: "Carregando…", en: "Loading…" },
  delete: { pt: "Apagar", en: "Delete" },
} satisfies Record<string, Record<Lang, string>>;

export type StringKey = keyof typeof strings;
