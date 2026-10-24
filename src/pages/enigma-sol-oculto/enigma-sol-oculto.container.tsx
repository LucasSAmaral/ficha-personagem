import { useFirestoreQueryData } from "@react-query-firebase/firestore";
import { collection, query } from "firebase/firestore";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { ButtonLink } from "../../components/Button.component";
import Loading from "../../components/Loading.component";
import Page from "../../components/Page.component";
import PageHeader from "../../components/PageHeader.component";
import { auth, firestore } from "../../firebase/firebase.utils";
import { FocusCssStyle, LabelCssStyle, media } from "../../theme/tokens";

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
        <PersonagemContent>
          {personagensByUser.map((personagem, index) => {
            const personagemNome = personagem.Nome as string;
            const safePersonagemNome = personagemNome.replace(" ", "_");
            return (
              <PersonagemCard
                key={`${personagem.Nome}-${index}`}
                to={safePersonagemNome}
              >
                <PersonagemCardNome>{personagem.Nome}</PersonagemCardNome>
                <PersonagemCardStats>
                  <div>
                    <dt>Saúde</dt>
                    <PersonagemCardValue
                      $color={
                        personagem.morto
                          ? "var(--ink-muted)"
                          : "var(--stat-vital)"
                      }
                    >
                      {personagem.saude}
                    </PersonagemCardValue>
                  </div>
                  <div>
                    <dt>Sanidade</dt>
                    <PersonagemCardValue
                      $color={
                        personagem.morto
                          ? "var(--ink-muted)"
                          : "var(--stat-mind)"
                      }
                    >
                      {personagem.sanidade}
                    </PersonagemCardValue>
                  </div>
                  <div>
                    <dt>Libras</dt>
                    <PersonagemCardValue
                      $color={
                        personagem.morto
                          ? "var(--ink-muted)"
                          : "var(--stat-coin)"
                      }
                    >
                      {personagem.dinheiro}
                    </PersonagemCardValue>
                  </div>
                </PersonagemCardStats>
                <PersonagemCardMeta>
                  Último parágrafo{" "}
                  <b>
                    {personagem.ultimoParagrafo
                      ? `§ ${personagem.ultimoParagrafo}`
                      : "—"}
                  </b>
                </PersonagemCardMeta>
                {personagem.morto && (
                  <PersonagemCardStamp>Morto</PersonagemCardStamp>
                )}
              </PersonagemCard>
            );
          })}
        </PersonagemContent>
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

const PersonagemContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--space-sm);

  ${media.mobile} {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const PersonagemCardStats = styled.dl`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-xs);

  div {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  dt {
    ${LabelCssStyle}
    font-size: 13px;
    line-height: 16px;
  }
`;

const PersonagemCardValue = styled.dd<{ $color: string }>`
  font-family: var(--fp-stat-font);
  font-weight: var(--fp-stat-weight);
  font-size: 24px;
  line-height: 28px;
  font-variant-numeric: tabular-nums lining-nums;
  color: ${({ $color }) => $color};
`;

const PersonagemCard = styled(Link)`
  ${FocusCssStyle}
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  padding: var(--space-md);
  color: var(--ink);
  text-decoration: none;
  background: var(--surface-raised);
  border: 1px solid var(--line);
  border-top: 4px double var(--line);
  border-radius: var(--fp-radius);
  box-shadow: var(--shadow-raised);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const PersonagemCardNome = styled.h2`
  padding-right: 90px;
  font-family: var(--fp-heading-font);
  font-weight: var(--fp-heading-weight);
  font-size: 24px;
  line-height: 30px;
  overflow-wrap: anywhere;
`;

const PersonagemCardMeta = styled.span`
  padding-top: var(--space-xs);
  font-size: 15px;
  line-height: 20px;
  color: var(--ink-muted);
  border-top: 1px solid var(--hairline);

  b {
    font-family: var(--fp-stat-font);
    font-weight: var(--fp-stat-weight);
    color: var(--ink);
  }
`;

const PersonagemCardStamp = styled.span`
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  padding: 2px 8px;
  font-family: var(--fp-label-font);
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--danger);
  border: 2px solid var(--danger);
  border-radius: var(--fp-radius);
  transform: rotate(var(--fp-stamp-rotate));
`;

const CriarPersonagem = styled(ButtonLink)`
  align-self: center;
`;

export default EnigmaSolOcultoContainer;
