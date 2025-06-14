import { useFirestoreQueryData } from "@react-query-firebase/firestore";
import { collection, query } from "firebase/firestore";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { auth, firestore } from "../../firebase/firebase.utils";
import { ButtonCssStyle } from "../../theme/styles";
import { MainPageWrapper } from "../main/Main.container";
import Loading from "./components/loading-component";

const EnigmaSolOcultoContainer: React.FC = () => {
  const navigate = useNavigate();
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

  if (!data) {
    return null;
  }

  const personagensByUser = data.filter(d => d.userId === userId);

  switch (status as "idle" | "error" | "loading" | "success") {
    case "loading":
    case "idle":
      return (
        <Loading>
          <h2>Loading...</h2>
        </Loading>
      );
    case "error":
      return <ErrorMessage>Erro ao mostrar lista de personagens</ErrorMessage>;
    case "success":
      return (
        <EnigmaWrapper>
          <PersonagemTitle>Personagens</PersonagemTitle>
          <PersonagemContent>
            {personagensByUser.map((personagem, index) => (
              <PersonagemWrapper
                key={`${personagem.Nome}-${index}`}
                onClick={() => {
                  const personagemNome = personagem.Nome as string;
                  const safePersonagemNome = personagemNome.replace(" ", "_");
                  navigate(`${safePersonagemNome}`);
                }}
              >
                <p>{personagem.Nome}</p>
                <p>Saúde: {personagem.saude}</p>
                <p>Sanidade: {personagem.sanidade}</p>
                <p>Dinheiro: {personagem.dinheiro}</p>
                <p>Morto: {personagem.morto ? "sim" : "não"}</p>
                <p>Último Parágrafo: {personagem.ultimoParagrafo}</p>
              </PersonagemWrapper>
            ))}
          </PersonagemContent>
          <CriarPersonagem to="/enigma-sol-oculto/personagem/criar">
            Criar Personagem
          </CriarPersonagem>
        </EnigmaWrapper>
      );
  }
};

const ErrorMessage = styled(Loading)`
  color: red;
`;

const EnigmaWrapper = styled(MainPageWrapper)`
  grid-template-areas:
    "title title title title"
    "conteudo conteudo conteudo conteudo"
    ". criarPersonagem criarPersonagem .";
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto;

  @media (max-width: 425px) {
    grid-template-areas:
      "title"
      "conteudo"
      "criarPersonagem";
    grid-template-columns: 1fr;
    row-gap: 1rem;
  }
`;

const PersonagemTitle = styled.h2`
  font-size: ${props => props.theme.titleFontSize};
  grid-area: title;
`;

const PersonagemContent = styled.div`
  grid-area: conteudo;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 15px;
  row-gap: 15px;

  @media (max-width: 425px) {
    grid-template-columns: 1fr;
    justify-items: center;
  }
`;

const PersonagemWrapper = styled.div`
  border: 1px solid black;
  cursor: pointer;
  padding: 10px;

  @media (max-width: 425px) {
    width: 200px;
  }
`;

const CriarPersonagem = styled(Link)`
  grid-area: criarPersonagem;
  ${ButtonCssStyle}
`;

export default EnigmaSolOcultoContainer;
