# Renomear para "Kay's Art Prompt Maker" + preparar app instalável com offline

## 1. Novo nome em todo o app

Trocar toda ocorrência de "Risco Solto" por **Kay's Art Prompt Maker**:

- Marca no cabeçalho (chave `brand` em PT e EN).
- Títulos e descrições de compartilhamento das páginas: início, categoria, salvos, e os padrões do site.
- Página 404 de categoria.
- README (título e textos).

Nome curto para o ícone no celular: **Art Prompts** (nome completo fica na loja de instalação do navegador).

## 2. App instalável com funcionamento offline

- Manifesto do app com nome, nome curto, cores do tema (papel/clay), abertura em tela cheia (`standalone`) e entradas de ícone.
- Tags no `<head>`: manifest, `theme-color`, `apple-touch-icon` e favicons.
- Suporte offline via `vite-plugin-pwa` (modo `generateSW`, atualização automática):
  - páginas sempre tentam a rede primeiro e caem para o cache quando sem internet;
  - arquivos de build (JS/CSS/fontes/ícones) servidos do cache;
  - registro só acontece no app publicado — nunca no preview do editor nem em desenvolvimento;
  - interruptor `?sw=off` para desinstalar o cache se necessário.
- Como o app já guarda favoritos, histórico e idioma no próprio navegador, tudo continua funcionando offline; sorteios e timer também, por serem locais.

## 3. Ícones — arte enviada por você

Preparo a estrutura esperando os arquivos, com placeholders temporários derivados do favicon atual:

```text
public/icons/icon-192.png     Android / instalação
public/icons/icon-512.png     Android / splash
public/icons/icon-maskable-512.png  Android adaptativo (com margem de segurança)
public/icons/apple-touch-icon.png   iOS (180x180)
```

Quando você enviar a arte, substituo esses quatro arquivos sem mexer em mais nada.

## Detalhes técnicos

- `vite-plugin-pwa` com `devOptions.enabled: false`, `injectRegister: null`, `registerType: "autoUpdate"`, SW em `/sw.js`.
- Módulo único de registro (`src/lib/pwa.ts`) chamado no cliente, recusando registro em dev, dentro de iframe, em domínios de preview da Lovable e com `?sw=off` (desregistrando SWs existentes nesses casos).
- Navegações com `NetworkFirst`; assets same-origin com hash em `CacheFirst`; `/~oauth` fora do fallback.
- Manifesto em `public/manifest.webmanifest`, referenciado em `links` no `head()` de `src/routes/__root.tsx`.

## Observações

- Offline só vale no app publicado — no preview do editor o service worker fica desligado de propósito.
- Isso não é publicação na App Store / Play Store; é instalação direta pelo navegador (Android: "Instalar app"; iOS: Compartilhar > Adicionar à Tela de Início). O caminho para as lojas exige exportar o projeto e contas de desenvolvedor — podemos tratar depois.
