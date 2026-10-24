import { useAuthSignOut, useAuthUser } from "@react-query-firebase/auth";
import React from "react";
import styled from "styled-components";
import BookTile from "../../components/BookTile.component";
import Button, { ButtonLink } from "../../components/Button.component";
import Loading from "../../components/Loading.component";
import Page from "../../components/Page.component";
import PageHeader from "../../components/PageHeader.component";
import { auth } from "../../firebase/firebase.utils";
import { media } from "../../theme/tokens";

const MainPageContainer: React.FC = () => {
  const mutation = useAuthSignOut(auth);
  const { isLoading } = useAuthUser(["user"], auth);

  if (isLoading) {
    return <Loading fullPage>Carregando</Loading>;
  }

  if (!auth.currentUser) {
    return (
      <Page>
        <PageHeader title="Ficha Personagem" />
        <MainPageIntro>
          Guarde o progresso dos seus livros-jogo sem papel e sem borracha:
          atributos, itens, notas e o último parágrafo lido.
        </MainPageIntro>
        <MainPageActions>
          <ButtonLink to="/login">Entrar</ButtonLink>
          <ButtonLink to="/sign-up" $quiet>
            Criar conta
          </ButtonLink>
        </MainPageActions>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader title="Ficha Personagem" eyebrow="Sua estante" />
      <MainPageBooks>
        <BookTile
          to="/enigma-sol-oculto/personagem"
          theme="sol-oculto"
          kind="Investigação lovecraftiana"
          title="O Enigma do Sol Oculto"
          meta="Abrir investigadores"
        />
        <BookTile
          to="/uivo-do-lobisomem/personagem"
          theme="lobisomem"
          kind="Fantasia sombria"
          title="Uivo do Lobisomem"
          meta="Abrir aventureiros"
        />
      </MainPageBooks>
      <MainPageActions>
        <ButtonLink to="/sobre-a-aplicacao" $quiet>
          Sobre a aplicação
        </ButtonLink>
        <Button type="button" $quiet onClick={() => mutation.mutate()}>
          Sair
        </Button>
      </MainPageActions>
    </Page>
  );
};

const MainPageIntro = styled.p`
  max-width: 46ch;
`;

const MainPageBooks = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-sm);

  ${media.mobile} {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const MainPageActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
`;

export default MainPageContainer;
