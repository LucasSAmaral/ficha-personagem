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

> O único teste (`src/App.test.tsx`) é o template do CRA e procura o texto "learn react", que não existe na aplicação — ele falha. Não há suíte de testes real.

## Stack

| Área | Biblioteca |
| --- | --- |
| UI | React 17 (`ReactDOM.render`, não `createRoot`) |
| Rotas | `react-router-dom` v6 (`BrowserRouter`, `Routes`, `Route`, `useNavigate`, `useParams`, `Link`) |
| Estilo | `styled-components` v5 + `ThemeProvider` |
| Formulários | `react-hook-form` (`useForm` + `Controller`) |
| Dados remotos | Firebase v9 modular (Auth + Firestore) |
| Cache/queries | `react-query` v3 via `@react-query-firebase/auth` e `@react-query-firebase/firestore` |

## Estrutura

```
src/
  index.tsx            # entrada: GlobalStyle, ThemeProvider, QueryClientProvider, AppRoutes
  Routes.tsx           # todas as rotas da aplicação em um único lugar
  components/          # componentes compartilhados entre páginas (FormInput.component.tsx)
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
      components/                                # componentes específicos da ficha
  theme/
    index.ts           # objeto `theme` (titleFontSize, paragraphFontSize)
    styles.ts          # blocos `css` reutilizáveis (ButtonCssStyle)
    global.style.ts    # createGlobalStyle (reset)
```

Cada livro-jogo ganha sua própria pasta em `src/pages/<slug-do-livro>/`, com seus `components/` internos.

## Convenções de nomes e arquivos

- **Sufixos de arquivo**:
  - `*.container.tsx` — páginas/telas ligadas a uma rota, que buscam/gravam dados.
  - `*.component.tsx` — componentes de apresentação.
- **Casing dos arquivos**: páginas antigas usam PascalCase (`Login.container.tsx`, `Main.container.tsx`, `FormInput.component.tsx`); a feature `enigma-sol-oculto` usa kebab-case (`personagem-notas.component.tsx`). Para arquivos novos dentro de uma pasta, siga o casing que já existe nela.
- **Nomes de componentes**: PascalCase com sufixo — `LoginContainer`, `MainPageContainer`, `PersonagemNotasComponent`, `FormInputComponent`. Ao importar, o sufixo às vezes é omitido (`import Notas from "./components/personagem-notas.component"`).
- **Idioma**: domínio, textos de UI, rotas, mensagens de `alert` e commits em **português** (`personagem`, `saude`, `sanidade`, `tracos`, `equipamento`, `ultimoParagrafo`). Termos técnicos/genéricos ficam em inglês (`Wrapper`, `Title`, `Button`, `Loading`, `onSubmit`).
- **Rotas**: kebab-case em português — `/enigma-sol-oculto/personagem`, `/enigma-sol-oculto/personagem/criar`, `/enigma-sol-oculto/personagem/:nomePersonagem`, `/sobre-a-aplicacao`, `/sign-up`. Toda rota nova é registrada em `src/Routes.tsx`, dentro do `<Route path="/">`. Páginas ainda não implementadas usam um fragmento placeholder (`element={<>Quase lá...</>}`).

## Padrões de componentes

- Componentes funcionais tipados com `React.FC<Props>` e props desestruturadas na assinatura.
- `import React from "react"` no topo de todo arquivo `.tsx`.
- Tipos de props declarados com `type` (não `interface`), logo acima do componente. Tipos compartilhados são exportados do arquivo onde nasceram (ex.: `PersonagemStateProps` e `PersonagemProps` em `enigma-sol-oculto-personagem.component.tsx`).
- Uniões de string literais para restringir valores (`type NumberProp = "saude" | "sanidade" | "dinheiro"`, `type GridArea = ...`), usadas também para indexar o objeto do personagem (`personagem[prop]`).
- Mapas de label como objetos simples (`const PropMap = { tracos: "Traço", equipamento: "Equipamento" }`).
- **Um `export default` por arquivo** (o componente), sempre na última linha. Exports nomeados apenas para tipos e styled components reutilizados (ex.: `export const MainPageWrapper`).
- Estado da ficha: o componente pai mantém `personagem`/`setPersonagem` com `useState` e repassa ambos aos filhos; os filhos atualizam com spread imutável: `setPersonagem({ ...personagem, [prop]: novoValor })`.
- Navegação programática com `useNavigate()` (`navigate("/")`, `navigate(-1)` para voltar).
- Feedback de erro ao usuário via `alert("...")` em português; loading com o texto `"Loading..."` (às vezes via `LoadingComponent`).

## Estilo (styled-components)

- Os styled components ficam **no mesmo arquivo**, **abaixo** do componente e **acima** do `export default`.
- Nomes prefixados pelo contexto do componente: `PersonagemNotas`, `PersonagemNotasTitle`, `PersonagemNotasValueWrapper`, `LoginWrapper`, `LoginTitle`, `LoginForm`, `LoginButton`.
- **Layout via CSS Grid com `grid-template-areas`**:
  - Toda página estende `MainPageWrapper` (exportado de `pages/main/Main.container.tsx`): `const LoginWrapper = styled(MainPageWrapper)\`...\``, sobrescrevendo `grid-template-areas`/`grid-template-rows`.
  - Cada filho define seu `grid-area`; quando dinâmico, recebe uma prop tipada (`styled.div<{ prop: NumberProp }>` com `grid-area: ${({ prop }) => prop};`).
- **Responsividade**: um único breakpoint mobile, `@media (max-width: 425px)`, normalmente reorganizando as grid areas em uma coluna.
- Botões e links com aparência de botão reutilizam `${ButtonCssStyle}` de `theme/styles.ts`; em `<button>` acrescente `border: none; cursor: pointer;`. Links estilizados usam `styled(Link)`.
- Títulos de página: `styled.h2` com `font-size: ${props => props.theme.titleFontSize};` e `grid-area: title;`.
- Estilo condicional com props transitórias simples (`status`, `isUserLoggedIn`) e o helper `css` para blocos alternativos.
- Valores de cor ainda são literais no CSS (ex.: `#310303`, `#2ceb2c`); o `theme` só contém tamanhos de fonte.

## Formulários

- `useForm<ControlFormData>({ mode: "onSubmit" })` e o componente compartilhado `FormInputComponent` (`control`, `name`, `label`, `type`, `required`).
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
  - `enigma-sol-oculto-fichas` — documento com id `` `${userId}__${nome}` ``, onde espaços do nome viram `_` (`nome.replace(" ", "_")`). O campo `userId` é gravado no documento e usado para filtrar a lista. Ao salvar alterações, sempre inclua `userId`.
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
- Em `SignUp.container.tsx`, a checagem `"confirmPassword" &&` não usa `in formData`, e a validação de senhas diferentes mostra o alerta mas não interrompe o cadastro.
- `replace(" ", "_")` só troca o primeiro espaço do nome do personagem.
- A lista de personagens busca toda a coleção e filtra por `userId` no cliente.
