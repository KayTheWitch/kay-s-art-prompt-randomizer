# Gerador de Prompts de Desenho

Um app leve para artistas sortearem temas de desenho, organizado por área temática.

## Estrutura

Quatro áreas temáticas, cada uma com sua própria página e identidade visual (cor de destaque + ícone):

- Personagens & Criaturas — retratos, fantasia, monstros, animais antropomórficos
- Cenários & Ambientes — paisagens, cidades, interiores, sci-fi
- Objetos & Still life — natureza morta, adereços, comida, mecânica
- Exercícios de estudo — anatomia, pose, perspectiva, cor/valor, desenho cronometrado

A home apresenta as quatro áreas em cards grandes, mais um botão "Sortear de qualquer área".

## Como o prompt funciona

Cada área gera uma frase única montada a partir de slots (ex.: sujeito + traço/ação + ambiente + humor/estilo). Abaixo da frase, cada slot aparece como um chip com botão de re-sortear individual, então dá para travar o que gostou e trocar só o resto. Botão grande de "Sortear tudo".

Exemplo (Personagens): "Uma ferreira idosa de braço mecânico, rindo, numa estufa alagada, luz de tempestade."

## Recursos

- Favoritos e histórico — prompts salvos no navegador (sem login); página dedicada para revisitar, refavoritar ou apagar.
- Timer de sketch — presets 30s / 2min / 5min / 10min + valor livre, com barra de progresso e aviso ao terminar. Fica junto ao prompt sorteado.
- Copiar / compartilhar — copiar o prompt como texto e link compartilhável que reabre o mesmo prompt.

## Design

Direção visual de ateliê: papel quente, tipografia com personalidade, acentos coloridos por área temática, cantos e cartões com toque de caderno de esboço. Sem cara de template genérico. Layout responsivo, bom em celular (o artista sorteia no telefone e desenha no papel).

## Detalhes técnicos

- Rotas: `/` (home com as áreas), `/personagens`, `/cenarios`, `/objetos`, `/estudos`, `/salvos`. Cada rota com head() próprio (título/descrição/OG).
- Bancos de palavras em TypeScript por categoria (`src/data/*.ts`), com slots tipados; gerador puro em `src/lib/prompt.ts` (sem backend).
- Estado de favoritos/histórico em `localStorage` via hook `useSavedPrompts`, lido após hidratação para evitar mismatch de SSR.
- Prompt compartilhável codificado nos search params da rota da área; ao abrir, restaura os slots exatos.
- Timer como componente isolado com `useEffect`/`requestAnimationFrame`.
- Tokens de cor por área no design system em `src/styles.css`; nada de cores hardcoded nos componentes.
- Sem banco de dados nem login nesta versão.
