# Idiomas (PT/EN) + README completo

## Seletor de idioma

Botão compacto "PT | EN" no header (ao lado de "Salvos"), sempre visível no mobile.

- Primeira visita: detecta o idioma do navegador (inglês → EN, qualquer outro → PT).
- A escolha fica salva no navegador e vale para todas as páginas.
- Traduz **tudo**: interface (home, cards, botões, timer, salvos, 404) e também os prompts — cada opção de cada slot ganha versão em inglês, e as frases são montadas com a gramática correta do idioma (conectores como "com/with", "sob/under").
- Links compartilhados continuam funcionando: o prompt é reconstruído pelos mesmos índices, exibido no idioma atual de quem abrir.
- Prompts salvos guardam a categoria e os índices, então aparecem traduzidos conforme o idioma ativo.
- Títulos e descrições das páginas (SEO) também acompanham o idioma.

## README

Reescrito em português e inglês, cobrindo:

- O que o app é e para quem serve.
- Stack: React 19, TanStack Start (SSR) + TanStack Router (rotas por arquivo), TanStack Query, Vite 7, TypeScript, Tailwind CSS v4 via `src/styles.css`, shadcn/ui + Radix, lucide-react, sonner, Bun/npm.
- Estrutura de pastas (`src/routes`, `src/components`, `src/data`, `src/lib`, `src/hooks`).
- Como funciona o gerador de prompts (slots, re-sorteio, links compartilháveis, favoritos em localStorage, timer).
- Como rodar localmente, scripts disponíveis (`dev`, `build`, `lint`, `format`) e como adicionar novas categorias/palavras.
- Nota de que não há banco de dados nem login.

## Detalhes técnicos

- `src/data/categories.ts` passa a ter textos bilíngues: `name/tagline/description` como `{ pt, en }` e cada `Slot` com `label`, `prefix` e `options` por idioma (mesma ordem/índice nos dois, preservando os links já compartilhados).
- `src/i18n/` com `LanguageProvider` (contexto + localStorage + detecção via `navigator.language` após hidratação, sem mismatch de SSR) e `strings.ts` com todas as chaves de UI.
- Hook `useI18n()` retornando `{ lang, setLang, t }`; componentes deixam de ter strings literais.
- `src/lib/prompt.ts` recebe o idioma em `toSentence`/`slotValues`; capitalização e junção por idioma.
- Provider montado em `src/routes/__root.tsx` acima do `SiteHeader`; `lang` do `<html>` atualizado no cliente.
- Novo `LanguageToggle.tsx` no header, no estilo toon existente.
