# Kay's Art Prompt Maker — gerador de prompts de desenho / drawing prompt generator

Aplicativo web de uso pessoal que sorteia temas de desenho por área temática, para artistas de arte
tradicional ou digital. Interface bilíngue (português / inglês).

Web app for personal use that shuffles drawing prompts by theme, for traditional and digital artists.
Bilingual interface (Portuguese / English).

---

## Funcionalidades / Features

- Quatro áreas temáticas: Personagens & Criaturas, Cenários & Ambientes, Objetos & Still life,
  Exercícios de estudo.
- Prompt montado por *slots* (sujeito, traço, ação, clima…), com re-sorteio individual de cada slot.
- Favoritos e histórico salvos no navegador (`localStorage`), sem cadastro nem banco de dados.
- Timer de sketch com presets (30s a 25min) e tempo livre.
- Copiar o prompt como texto ou copiar um link compartilhável que reabre o mesmo sorteio.
- Instalável no celular (PWA): ícone na tela inicial, tela cheia e funcionamento offline
  no app publicado (service worker gerado por `vite-plugin-pwa`, desativado no preview/dev).
- Seletor de idioma PT/EN: traduz a interface **e** os prompts. Na primeira visita o idioma é
  detectado pelo navegador (português → PT, qualquer outro → EN) e a escolha fica salva.

## Stack

| Camada | Tecnologia |
| --- | --- |
| UI | React 19 |
| Framework | TanStack Start 1.x (SSR, servido em runtime edge) |
| Rotas | TanStack Router (file-based routing em `src/routes`) |
| Dados assíncronos | TanStack Query |
| Build | Vite 7 + `@tanstack/router-plugin` |
| Linguagem | TypeScript 5 (strict), path alias `@/*` |
| Estilos | Tailwind CSS v4 configurado em `src/styles.css` (tokens `@theme`, sem `tailwind.config.js`) |
| Componentes | shadcn/ui sobre Radix UI, `class-variance-authority`, `tailwind-merge` |
| Ícones | lucide-react |
| Toasts | sonner |
| PWA | vite-plugin-pwa (generateSW, offline) |
| Validação | zod |
| Formulários | react-hook-form + `@hookform/resolvers` |
| Qualidade | ESLint 9 (flat config) + Prettier |
| Runtime/dev | Node.js 20+ ou Bun; deploy como Worker edge |

Sem backend, sem banco de dados e sem autenticação: todo os dados do usuário vivem no navegador.

## Estrutura do projeto

```text
src/
  routes/            rotas file-based (__root.tsx, index.tsx, $categoria.tsx, salvos.tsx)
  components/        PromptStudio, SketchTimer, SiteHeader, LanguageToggle, ui/ (shadcn)
  data/categories.ts bancos de palavras bilíngues por categoria e slot
  i18n/              LanguageProvider (contexto + localStorage) e strings.ts (textos de UI)
  lib/               prompt.ts (sorteio, frase, encode/decode do link), accents.ts, utils.ts
  hooks/             useSavedPrompts (favoritos e histórico em localStorage)
  styles.css         design system: cores, fontes e utilitários "toon"
```

## Como o gerador funciona

Cada categoria define slots ordenados; um sorteio é apenas um array de índices
(`[3, 7, 1, 0]`). A frase é montada em `src/lib/prompt.ts` juntando as opções do idioma ativo
com os conectores certos (`com` / `with`, `sob` / `under`). Como o link compartilhável guarda
somente os índices (`/personagens?p=3-7-1-0`), o mesmo prompt reabre em qualquer idioma.

## Rodando localmente

Requer Node.js 20+ (ou Bun) e npm.

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev      # http://localhost:8080
```

Scripts: `dev`, `build`, `build:dev`, `preview`, `lint`, `format`.

## Adicionando categorias ou palavras

Edite `src/data/categories.ts`. Cada slot tem `options: { pt: string[]; en: string[] }` — as duas
listas precisam ter o **mesmo tamanho e a mesma ordem**, porque o índice é o que viaja no link
compartilhado. Para uma nova categoria, adicione o objeto com `slug`, `name`, `short`, `tagline`,
`description`, `accent` e os slots; a rota `/$categoria` e a navegação se atualizam sozinhas.
