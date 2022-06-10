import React from "react";
import styled from "styled-components";
import { useFirestoreQueryData } from "@react-query-firebase/firestore";
import { MainPageWrapper } from "../main/Main.container";
import { query, collection } from "firebase/firestore";
import { firestore } from "../../firebase/firebase.utils";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const EnigmaSolOcultoContainer: React.FC = () => {
  const navigate = useNavigate();
  const ref = query(collection(firestore, "enigma-sol-oculto-fichas"));
  const fichasQueryData = useFirestoreQueryData(
    ["enigma-sol-oculto-fichas"],
    ref,
    {
      subscribe: true
    }
  );

  const { data, status } = fichasQueryData;

  if (!data) {
    return null;
  }

  switch (status as "idle" | "error" | "loading" | "success") {
    case "loading":
    case "idle":
      return <>Loading...</>;
    case "error":
      return <>Erro ao mostrar lista de personagens</>;
    case "success":
      return (
        <EnigmaWrapper>
          <PersonagemTitle>Personagens</PersonagemTitle>
          <PersonagemContent>
            {data.map((personagem, index) => (
              <PersonagemWrapper
                key={index}
                onClick={() => navigate(`${personagem.Nome}`)}
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

const EnigmaWrapper = styled(MainPageWrapper)`
  grid-template-areas:
    "title title title title"
    ". . . ."
    ". criarPersonagem criarPersonagem .";
  grid-template-columns: repeat(4, 1fr);
`;

const PersonagemTitle = styled.h2`
  font-size: ${props => props.theme.titleFontSize};
  grid-area: title;
`;

const PersonagemContent = styled.div``;

const PersonagemWrapper = styled.div`
  border: 1px solid black;
  cursor: pointer;
`;

const CriarPersonagem = styled(Link)`
  grid-area: criarPersonagem;
  text-decoration: none;
  background-color: #310303;
  color: white;
  font-weight: bold;
  text-align: center;
  padding: 20px 0px;
  margin: 0 auto;
  text-transform: uppercase;
  width: 300px;
  align-self: center;
`;

export default EnigmaSolOcultoContainer;
