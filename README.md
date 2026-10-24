# Ficha Personagem

Fichas de livros-jogo, sem borracha. O app guarda o progresso das suas aventuras (atributos, itens, notas e o último parágrafo lido) para você não precisar anotar no papel e apagar a cada mudança.

Cada livro tem a ficha no clima da própria história:

| Livro | Tema | Ficha |
| --- | --- | --- |
| **O Enigma do Sol Oculto** | Investigação lovecraftiana: dossiê de papel e máquina de escrever | Saúde, Sanidade, Libras, Traços, Equipamento, Notas, Último parágrafo, Status |
| **Uivo do Lobisomem** | Fantasia sombria medieval: noite, letras góticas e ferro | Habilidade, Energia e Sorte (com valores iniciais), Ouro, Provisões, Transformação, Equipamento, Notas e senhas, Encontros com monstros, Último parágrafo, Status |

A ficha salva sozinha enquanto você joga, e sem conexão as mudanças ficam no aparelho até a rede voltar. O app é um PWA e pode ser instalado no celular.

## Rodando localmente

Requer Node 16 (versão no `.nvmrc`).

```bash
nvm use
npm install
npm start        # http://localhost:3000
```

Com Node 17 ou mais novo, o webpack do `react-scripts` 2 falha com `ERR_OSSL_EVP_UNSUPPORTED`. Nesse caso, rode os comandos com `NODE_OPTIONS=--openssl-legacy-provider`:

```bash
NODE_OPTIONS=--openssl-legacy-provider npm start
```

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm start` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `build/` |
| `npm test` | Testes em modo watch |
| `npm run release` | Nova versão com standard-version e push para a `main` |

Para rodar só os testes do salvamento automático, uma vez:

```bash
CI=true npx react-scripts test --watchAll=false src/hooks
```

## Stack

- React 17 e TypeScript, criado com Create React App
- React Router 6
- styled-components 5, com os tokens do design system como CSS custom properties (`src/theme/tokens.ts`)
- react-hook-form
- Firebase 9 (Authentication e Firestore), via react-query e `@react-query-firebase`

## Estrutura

```
src/
  Routes.tsx      # rotas; cada livro fica sob o próprio tema (ThemeScope)
  components/     # componentes compartilhados pelos livros
  hooks/          # useAutoSave
  firebase/       # inicialização do Firebase
  pages/
    main/ login/ sign-up/
    enigma-sol-oculto/
    uivo-do-lobisomem/
  theme/          # tokens, estilos globais e de botão
```

As convenções do código (nomes, estilo, formatação, commits) estão descritas no [CLAUDE.md](CLAUDE.md).

## Dados

As fichas ficam no Firestore, uma coleção por livro (`enigma-sol-oculto-fichas` e `uivo-do-lobisomem-fichas`). Cada documento tem o id `<userId>__<nome-do-personagem>` e guarda o `userId` do dono.

## Versões e deploy

- As versões seguem o [standard-version](https://github.com/conventional-changelog/standard-version), e o histórico fica no [CHANGELOG.md](CHANGELOG.md). Gere a release na `main`, depois do merge.
- O deploy é feito pelo Netlify a partir da `main` (`netlify.toml`).
