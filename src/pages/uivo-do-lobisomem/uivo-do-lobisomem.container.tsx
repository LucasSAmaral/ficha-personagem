import { useFirestoreQueryData } from "@react-query-firebase/firestore";
import { collection, query } from "firebase/firestore";
import React, { useEffect } from "react";
import styled from "styled-components";
import { ButtonLink } from "../../components/Button.component";
import CharacterCard, {
  CharacterCardGrid
} from "../../components/CharacterCard.component";
import Loading from "../../components/Loading.component";
import Page from "../../components/Page.component";
import PageHeader from "../../components/PageHeader.component";
import { auth, firestore } from "../../firebase/firebase.utils";
import { COLECAO_LOBISOMEM } from "./uivo-do-lobisomem-personagem.component";

const UivoDoLobisomemContainer: React.FC = () => {
  const ref = query(collection(firestore, COLECAO_LOBISOMEM));
  const { data, status, refetch } = useFirestoreQueryData(
    [COLECAO_LOBISOMEM],
    ref,
    {
      subscribe: true
    }
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  const userId = auth.currentUser ? auth.currentUser.uid : "";

  if (status === "loading" || status === "idle") {
    return <Loading fullPage>Acendendo a lanterna</Loading>;
  }

  const personagensByUser = data ? data.filter(d => d.userId === userId) : [];

  return (
    <Page>
      <PageHeader
        back={{ to: "/", label: "Estante" }}
        eyebrow="Aventureiros"
        title="Uivo do Lobisomem"
      />

      {status === "error" && (
        <ErrorMessage role="alert">
          Não foi possível carregar os aventureiros. Verifique a conexão e
          recarregue a página.
        </ErrorMessage>
      )}

      {status === "success" && personagensByUser.length === 0 && (
        <EmptyMessage>
          Nenhum aventureiro ainda. Crie o primeiro antes que a lua suba.
        </EmptyMessage>
      )}

      {personagensByUser.length > 0 && (
        <CharacterCardGrid>
          {personagensByUser.map((personagem, index) => {
            const personagemNome = personagem.Nome as string;
            const safePersonagemNome = personagemNome.replace(" ", "_");
            return (
              <CharacterCard
                key={`${personagem.Nome}-${index}`}
                to={safePersonagemNome}
                nome={personagemNome}
                ultimoParagrafo={personagem.ultimoParagrafo}
                morto={Boolean(personagem.morto)}
                stats={[
                  {
                    label: "Habilidade",
                    value: personagem.habilidade,
                    color: "var(--ink)"
                  },
                  {
                    label: "Energia",
                    value: personagem.energia,
                    color: "var(--stat-vital)"
                  },
                  {
                    label: "Sorte",
                    value: personagem.sorte,
                    color: "var(--stat-mind)"
                  }
                ]}
              />
            );
          })}
        </CharacterCardGrid>
      )}

      <CriarPersonagem to="/uivo-do-lobisomem/personagem/criar">
        Novo aventureiro
      </CriarPersonagem>
    </Page>
  );
};

const ErrorMessage = styled.p`
  color: var(--danger);
`;

const EmptyMessage = styled.p`
  font-style: italic;
  color: var(--ink-muted);
`;

const CriarPersonagem = styled(ButtonLink)`
  align-self: center;
`;

export default UivoDoLobisomemContainer;
