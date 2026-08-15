import type { Lang } from "@/data/categories";

export const strings = {
  brand: { pt: "Kay's Art Prompt Maker", en: "Kay's Art Prompt Maker" },
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
  // curadoria
  difficulty: { pt: "Dificuldade", en: "Difficulty" },
  difficultyQuick: { pt: "Rápido", en: "Quick" },
  difficultyStudy: { pt: "Estudo", en: "Study" },
  difficultyChallenge: { pt: "Desafio", en: "Challenge" },
  lock: { pt: "Travar", en: "Lock" },
  unlock: { pt: "Destravar", en: "Unlock" },
  locked: { pt: "travado", en: "locked" },
  lockedCount: { pt: "travados", en: "locked" },
  block: { pt: "Não quero ver mais", en: "Don't show this again" },
  blockedWord: { pt: "Palavra bloqueada", en: "Word blocked" },
  unblockWord: { pt: "Desbloquear", en: "Unblock" },
  blockedTitle: { pt: "Palavras bloqueadas", en: "Blocked words" },
  noBlocked: {
    pt: "Nada bloqueado. Use o ícone de bloqueio no estúdio.",
    en: "Nothing blocked. Use the block icon in the studio.",
  },
  clearBlocked: { pt: "Limpar bloqueios", en: "Clear blocks" },
  allBlockedWarning: {
    pt: "Tudo bloqueado neste campo — os bloqueios foram ignorados aqui.",
    en: "Everything is blocked in this field — blocks were ignored here.",
  },
  // desafio do dia
  daily: { pt: "Desafio do dia", en: "Daily challenge" },
  dailySubtitle: {
    pt: "Um prompt novo por dia, o mesmo para todo mundo.",
    en: "A new prompt every day, the same for everyone.",
  },
  dailyCardCta: { pt: "Ver o desafio de hoje", en: "See today's challenge" },
  openCategory: { pt: "Abrir no estúdio", en: "Open in the studio" },
} satisfies Record<string, Record<Lang, string>>;

export type StringKey = keyof typeof strings;
