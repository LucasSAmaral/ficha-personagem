# CLAUDE.md

Guia para trabalhar neste repositório. Descreve os padrões que o código já segue — siga-os ao escrever código novo.

## Visão geral

**Ficha Personagem** é uma aplicação web (PWA) para gerenciar fichas de personagens de livros-jogo/aventuras solo (ex.: *O Enigma do Sol Oculto*, *Uivo do Lobisomem*). O usuário se cadastra, faz login e cria/edita fichas que ficam salvas no Firebase.

- Bootstrap: Create React App (`react-scripts`), TypeScript.
- Deploy: Netlify (`netlify.toml` → `npm run build`, publica `build/`).
- Node: versão em `.nvmrc` (16.15.0).

## Comandos

```bash
npm start        # dev server em http://localhost:3000
npm run build    # build de produção em build/
npm test         # jest em modo watch (react-scripts test)
npm run release  # standard-version (bump + CHANGELOG + tag) e push para origin main
```

> Com Node 17+ o webpack 4 do `react-scripts` 2 falha com `ERR_OSSL_EVP_UNSUPPORTED`. Localmente, rode com `NODE_OPTIONS=--openssl-legacy-provider npm run build` (ou `npm start`), ou use o Node do `.nvmrc`.
>
> O Babel do `react-scripts` 2 não entende optional chaining (`?.`) nem nullish coalescing (`??`): não use.
>
> Testes: `CI=true NODE_OPTIONS=--openssl-legacy-provider npx react-scripts test --watchAll=false src/hooks` roda os testes do `useAutoSave`. O `@testing-library/react` instalado (v13) exige React 18, então os testes usam `react-dom/test-utils` direto. `src/App.test.tsx` é o template do CRA e procura "learn react", que não existe na aplicação — ele falha.

## Stack

| Área | Biblioteca |
| --- | --- |
| UI | React 17 (`ReactDOM.render`, não `createRoot`) |
| Rotas | `react-router-dom` v6 (`BrowserRouter`, `Routes`, `Route`, `useNavigate`, `useParams`, `Link`) |
| Estilo | `styled-components` v5 + CSS custom properties do design system (sem `ThemeProvider`) |
| Formulários | `react-hook-form` (`useForm` + `Controller`) |
| Dados remotos | Firebase v9 modular (Auth + Firestore) |
| Cache/queries | `react-query` v3 via `@react-query-firebase/auth` e `@react-query-firebase/firestore` |

## Estrutura

```
src/
  index.tsx            # entrada: GlobalStyle, QueryClientProvider, AppRoutes
  Routes.tsx           # todas as rotas da aplicação em um único lugar
  components/          # componentes compartilhados pelos livros: Button, FormInput (campos),
                       # Page, PageHeader, Loading, BookTile, ThemeScope, StatCounter,
                       # ListField, StatusToggle, CharacterCard
  firebase/
    firebase.utils.ts  # initializeApp; exporta `auth` e `firestore`
  pages/
    main/Main.container.tsx
    login/Login.container.tsx
    sign-up/SignUp.container.tsx
    enigma-sol-oculto/
      enigma-sol-oculto.container.tsx            # lista de personagens
      enigma-sol-oculto-personagem.component.tsx # ficha (detalhe/edição) + tipos do personagem
      criar-personagem/criar-personagem.container.tsx
    uivo-do-lobisomem/
      uivo-do-lobisomem.container.tsx            # lista de aventureiros
      uivo-do-lobisomem-personagem.component.tsx # ficha + tipos (LobisomemStateProps, Monstro)
      criar-personagem/criar-personagem.container.tsx
      components/encontros-monstros.component.tsx # Caixas de Encontros com Monstros
  theme/
    tokens.ts          # tokens do design system como CSS custom properties, por tema;
                       # `media.mobile`, `LabelCssStyle`, `FocusCssStyle`, tipo `BookTheme`
    styles.ts          # ButtonCssStyle e QuietButtonCssStyle
    global.style.ts    # createGlobalStyle: tokens + reset + fundo/fonte do tema
```

Cada livro-jogo ganha sua própria pasta em `src/pages/<slug-do-livro>/` (lista, ficha, criação). Peças que servem a mais de um livro (contador, lista, status, card) ficam em `src/components/`; só o que é exclusivo de um livro vai para `src/pages/<slug>/components/`.

## Convenções de nomes e arquivos

- **Sufixos de arquivo**:
  - `*.container.tsx` — páginas/telas ligadas a uma rota, que buscam/gravam dados.
  - `*.component.tsx` — componentes de apresentação.
- **Casing dos arquivos**: páginas antigas usam PascalCase (`Login.container.tsx`, `Main.container.tsx`, `FormInput.component.tsx`); a feature `enigma-sol-oculto` usa kebab-case (`personagem-notas.component.tsx`). Para arquivos novos dentro de uma pasta, siga o casing que já existe nela.
- **Nomes de componentes**: PascalCase com sufixo — `LoginContainer`, `MainPageContainer`, `PersonagemNotasComponent`, `FormInputComponent`. Ao importar, o sufixo às vezes é omitido (`import Notas from "./components/personagem-notas.component"`).
- **Idioma**: domínio, textos de UI, rotas, mensagens de erro e commits em **português** (`personagem`, `saude`, `sanidade`, `tracos`, `equipamento`, `ultimoParagrafo`). Termos técnicos/genéricos ficam em inglês (`Wrapper`, `Title`, `Button`, `Loading`, `onSubmit`).
- **Rotas**: kebab-case em português — `/enigma-sol-oculto/personagem`, `/enigma-sol-oculto/personagem/criar`, `/enigma-sol-oculto/personagem/:nomePersonagem`, `/sobre-a-aplicacao`, `/sign-up`. Toda rota nova é registrada em `src/Routes.tsx`, dentro do `<Route path="/">`. As rotas de um livro ficam aninhadas sob um `<Route path="<slug>">` cujo elemento é `<ThemeScope theme="<tema>"><Outlet /></ThemeScope>`. Páginas ainda não implementadas usam um fragmento placeholder (`element={<>Quase lá...</>}`).

## Padrões de componentes

- Componentes funcionais tipados com `React.FC<Props>` e props desestruturadas na assinatura.
- `import React from "react"` no topo de todo arquivo `.tsx`.
- Tipos de props declarados com `type` (não `interface`), logo acima do componente. Tipos compartilhados são exportados do arquivo onde nasceram (ex.: `PersonagemStateProps` e `PersonagemProps` em `enigma-sol-oculto-personagem.component.tsx`).
- Uniões de string literais para restringir valores (`type NumberProp = "saude" | "sanidade" | "dinheiro"`), usadas também para indexar o objeto do personagem (`personagem[prop]`).
- Mapas simples como objetos (`const PropMap = { tracos: "traço", equipamento: "item" }`, `StatColorMap`).
- **Um `export default` por arquivo** (o componente), sempre na última linha. Exports nomeados apenas para tipos e styled components reutilizados (ex.: `FieldInput`, `FieldLabel`, `ButtonLink`).
- Estado da ficha: a página mantém `personagem` com `useState` e um helper `update(changes)` que aplica a mudança e chama `queue()` do `useAutoSave` (`src/hooks/useAutoSave.ts`). Não há botão de salvar: o hook grava 1s depois da última mudança, na hora ao esconder a página ou sair da ficha, e tenta de novo em caso de erro; `AutoSaveStatus` mostra o estado. O que chega do Firestore só é aplicado na tela quando `isDirty()` é falso. O Firestore usa cache offline (`enableIndexedDbPersistence` em `firebase.utils.ts`). Os componentes compartilhados são controlados: recebem `value`/`items`/`morto` e `onChange`, e aceitam `area` para o `grid-area`.
- Navegação programática com `useNavigate()`; o "voltar" das páginas é o link do `PageHeader` (`back={{ to, label }}`).
- **Não use `alert`.** Erros aparecem na tela em `var(--danger)`: no campo (prop `error` do `FormInputComponent`) ou num `<p role="alert">`, dizendo o que houve e o que fazer.
- Carregamento: `<Loading fullPage>Texto em português</Loading>`. Durante uma mutation, desabilite o botão e troque o rótulo ("Salvando…").

## Design system e estilo

O design system "Ficha Personagem" (https://claude.ai/artifact/5gPTS8oPU3M33A7TtbxQe8) define três temas com os mesmos nomes de token: `ficha` (estante: início, login, cadastro), `sol-oculto` (claro, dossiê lovecraftiano) e `lobisomem` (escuro, fantasia sombria). `src/theme/tokens.ts` é a cópia em código; mantenha os dois iguais.

- **Tema pela rota**: qualquer elemento com `data-theme` vira um escopo de tema. `ThemeScope` envolve as rotas de um livro; `BookTile` põe o `data-theme` do livro no próprio card.
- **Só tokens, nunca cores literais**: `var(--surface)`, `var(--surface-raised)`, `var(--ink)`, `var(--ink-muted)`, `var(--line)` (bordas de controle), `var(--hairline)` (divisórias), `var(--accent)`/`var(--on-accent)` (ação principal), `var(--accent-ink)` (accent como texto), `var(--danger)`, `var(--stat-vital|mind|coin)` (números de atributo), `var(--focus)`.
- **Tipografia por papel**: `var(--fp-title-font)`, `--fp-heading-font`, `--fp-label-font`, `--fp-stat-font`, `--fp-button-font` (cada tema define família, peso e tracking). Rótulos usam `${LabelCssStyle}`.
- **Espaço e forma**: `var(--space-2xs|xs|sm|md|lg|xl)` (5/10/15/20/30/50px), `var(--fp-radius)`, `var(--control-min)` (44px, alvo de toque), `var(--shadow-raised)`.
- Os styled components ficam **no mesmo arquivo**, **abaixo** do componente e **acima** do `export default`, com nomes prefixados pelo contexto (`PersonagemArrayTitle`, `LoginForm`).
- **Layout**: toda página usa `<Page>` (coluna com gap `space-lg`, largura `page-max`; `$wide` para `sheet-max`) e começa com `<PageHeader>`. Grids internos usam `grid-template-areas`; cada filho define seu `grid-area` (dinâmico via prop tipada, ex. `styled.div<{ prop: NumberProp }>`).
- **Responsividade**: um único breakpoint, `${media.mobile}` (`@media (max-width: 425px)`), normalmente uma coluna só.
- **Botões**: `Button`/`ButtonLink` de `components/Button.component.tsx`, com `$quiet` (secundário) e `$inline` (ao lado de um campo). Um primário por tela.
- **Foco visível** em tudo que é clicável: `${FocusCssStyle}` (contorno de 3px em `--focus`).
- Variações de um tema específico ficam no próprio componente com `[data-theme="sol-oculto"] & { ... }`. **Exceção:** em componentes com variantes por prop (como `Button`), o styled-components gera esse seletor com a classe estática compartilhada por todas as instâncias, e a regra vaza entre variantes. Nesses casos use uma variável `--fp-*` definida por tema em `tokens.ts` (ex.: `--fp-button-inset`).
- Props só de estilo são transitórias (`$quiet`, `$error`, `$color`).

## Formulários

- `useForm<ControlFormData>({ mode: "onSubmit" })` e o componente compartilhado `FormInputComponent` (`control`, `name`, `label`, `type`, `required`, `error`, `autoComplete`, `inputMode`).
- Campos fora do react-hook-form (Notas, Último Parágrafo) usam as peças exportadas `FieldWrapper`, `FieldLabel`, `FieldInput`, `FieldTextArea`, com `id` ligado ao `htmlFor`.
- Ao adicionar um campo novo, inclua o nome em `FormInputFields` e no tipo de dados correspondente em `src/components/FormInput.component.tsx`.
- Como `ControlFormData` é uma união, o `handleSubmit` estreita o tipo com checagens `"campo" in formData` antes de desestruturar.
- Inputs numéricos chegam como string e são convertidos com `Number.parseInt` antes de gravar.

## Firebase / dados

- Sempre importe `auth` e `firestore` de `src/firebase/firebase.utils.ts`; não inicialize o Firebase em outro lugar.
- Use os hooks do `@react-query-firebase/*` em vez de chamar o SDK diretamente:
  - Auth: `useAuthSignInWithEmailAndPassword`, `useAuthCreateUserWithEmailAndPassword`, `useAuthSignOut`, `useAuthUser(["user"], auth)`.
  - Firestore: `useFirestoreQueryData`, `useFirestoreDocumentData` (com `{ subscribe: true }`), `useFirestoreDocumentMutation(ref)`.
- Mutations são chamadas com callbacks `{ onSuccess, onError }`; renomeie `mutate` na desestruturação (`mutate: savePersonagem`, `mutate: createPersonagem`).
- Usuário atual: `const userId = auth.currentUser ? auth.currentUser.uid : "";`.
- **Coleções**:
  - `users` — documento com id = `uid`: `{ displayName, email, createdAt }`.
  - `enigma-sol-oculto-fichas` e `uivo-do-lobisomem-fichas` (`COLECAO_LOBISOMEM`) — documento com id `` `${userId}__${nome}` ``, onde espaços do nome viram `_` (`nome.replace(" ", "_")`). O campo `userId` é gravado no documento e usado para filtrar a lista. Ao salvar alterações, sempre inclua `userId`.
  - Fichas do Lobisomem guardam também os valores iniciais (`habilidadeInicial`, `energiaInicial`, `sorteInicial`), as notas em `notasESenhas` e `monstros: Monstro[]` (`{ id, nome, habilidade, energia }`). Ao ler, mescle com `initialState` para tolerar fichas sem algum campo.
- Query keys do react-query seguem `[nomeDaColecao, idDoDocumento]`.
- Novas fichas são criadas com todos os campos de `PersonagemStateProps` preenchidos (arrays vazios, `morto: false`, strings vazias).

## Formatação

- Indentação de 2 espaços, sem tabs (`.prettierrc`), aspas duplas, ponto e vírgula.
- O código segue o estilo do Prettier antigo: **sem trailing commas** em objetos/props multilinha e **arrow functions de um parâmetro sem parênteses** (`formData => ...`, `e => ...`).
- Não rode outro formatador (ex.: Biome) sobre o projeto — já houve um commit só para desfazer reformatação feita pelo Biome. Mantenha diffs restritos ao que foi alterado.

## Git e versionamento

- Mensagens de commit em português, no imperativo/presente da 3ª pessoa e descritivas: "Adiciona botão e rota para a página sobre a aplicação", "Ajusta grid-row de login...", "Extrai style dos botões em um arquivo a parte".
- Commits de release são gerados pelo `standard-version` (`chore(release): x.y.z`) e atualizam `CHANGELOG.md` e `package.json`; não edite esses arquivos à mão para versionar.
- Features em branches separadas, integradas na `main` via Pull Request.

## Pontos de atenção conhecidos

- `src/App.test.tsx` está desatualizado (ver Comandos).
- `replace(" ", "_")` só troca o primeiro espaço do nome do personagem.
- A lista de personagens busca toda a coleção e filtra por `userId` no cliente.
- Deslogado, `userId` é `""` e a ficha lê/grava documentos com id `__<nome>`.
- `/sobre-a-aplicacao` ainda é um placeholder.
