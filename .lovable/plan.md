# Curadoria e personalização

Quatro recursos novos no estúdio de prompts, todos salvos apenas no aparelho (localStorage), sem login.

## 1. Filtro de dificuldade
Seletor com três níveis, visível acima da frase:
- **Rápido**: usa só os 2 primeiros slots da categoria (frase curta e direta).
- **Estudo**: usa todos os slots (comportamento atual, padrão).
- **Desafio**: todos os slots + uma restrição extra sorteada (ex.: "sem apagar", "paleta de 2 cores", "em até 20 minutos"), num banco novo bilíngue compartilhado por todas as categorias.

A escolha fica salva e vale para todas as categorias. Frases mais curtas continuam gerando link compartilhável válido.

## 2. Desafio do dia
Nova página `/desafio` (`/challenge`) com um prompt fixo por dia, igual para qualquer pessoa: a data em UTC vira semente de sorteio determinística, escolhendo categoria e opções. Mostra a data, o prompt, botões de copiar/favoritar/link e o timer. Link na navegação do cabeçalho e um card de destaque na home.

## 3. Bloquear palavras
Cada opção do prompt ganha um botão "não quero ver mais" (ícone de bloqueio no chip do slot). Opções bloqueadas nunca mais são sorteadas. Uma seção "Palavras bloqueadas" na página de Salvos lista tudo com opção de desbloquear individualmente ou limpar tudo. Se todas as opções de um slot forem bloqueadas, o app avisa e ignora a lista naquele slot para não travar o sorteio.

## 4. Travar slots
Um cadeado em cada chip de slot. Slots travados não mudam ao usar "Sortear tudo" nem ao trocar de dificuldade — só mudam se você re-sortear aquele slot específico. Travas valem por categoria e persistem entre sessões.

## Interface
- Barra de controles compacta acima da frase: dificuldade (3 pílulas) + contador de travas.
- Cada chip de slot passa a ter três ações pequenas: re-sortear, travar, bloquear — mantidas no estilo toon, com alvos de toque de 44px e layout de coluna única no mobile.
- Tudo traduzido em PT e EN.

## Notas técnicas
- `src/lib/prompt.ts`: `drawAll` passa a receber `{ locks, blocked, difficulty }`; nova função de sorteio com semente (`mulberry32` a partir de `YYYY-MM-DD`) para o desafio do dia; slots ativos derivados da dificuldade.
- Novo `src/data/extras.ts` com o banco bilíngue de restrições de desafio.
- Novo hook `src/hooks/usePreferences.ts` (localStorage `kay-prompts:prefs:v1`) guardando dificuldade, travas por categoria e opções bloqueadas (`slug:slotKey:index`).
- Nova rota `src/routes/desafio.tsx` com `head()` próprio (título, descrição, og/twitter).
- `PromptStudio.tsx` consome preferências e ganha os controles; `salvos.tsx` ganha a seção de bloqueados.
- Strings novas em `src/i18n/strings.ts`.
- Formato de link (`?p=1-2-3`) e favoritos existentes continuam funcionando; travas e bloqueios não entram na URL.
