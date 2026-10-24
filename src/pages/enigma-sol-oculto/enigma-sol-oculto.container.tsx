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

const EnigmaSolOcultoContainer: React.FC = () => {
  const ref = query(collection(firestore, "enigma-sol-oculto-fichas"));
  const { data, status, refetch } = useFirestoreQueryData(
    ["enigma-sol-oculto-fichas"],
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
    return <Loading fullPage>Abrindo os arquivos</Loading>;
  }

  const personagensByUser = data ? data.filter(d => d.userId === userId) : [];

  return (
    <Page>
      <PageHeader
        back={{ to: "/", label: "Estante" }}
        eyebrow="Investigadores"
        title="O Enigma do Sol Oculto"
      />

      {status === "error" && (
        <ErrorMessage role="alert">
          Não foi possível carregar os investigadores. Verifique a conexão e
          recarregue a página.
        </ErrorMessage>
      )}

      {status === "success" && personagensByUser.length === 0 && (
        <EmptyMessage>
          Nenhum investigador ainda. Crie o primeiro para abrir o caso.
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
                    label: "Saúde",
                    value: personagem.saude,
                    color: "var(--stat-vital)"
                  },
                  {
                    label: "Sanidade",
                    value: personagem.sanidade,
                    color: "var(--stat-mind)"
                  },
                  {
                    label: "Libras",
                    value: personagem.dinheiro,
                    color: "var(--stat-coin)"
                  }
                ]}
              />
            );
          })}
        </CharacterCardGrid>
      )}

      <CriarPersonagem to="/enigma-sol-oculto/personagem/criar">
        Novo investigador
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

export default EnigmaSolOcultoContainer;
