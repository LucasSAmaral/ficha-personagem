import React from "react";
import styled from "styled-components";
import { useFirestoreQueryData } from "@react-query-firebase/firestore";
import { MainPageWrapper } from "../main/Main.container";
import { query, collection } from "firebase/firestore";
import { firestore } from "../../firebase/firebase.utils";
import { useNavigate } from "react-router-dom";

const EnigmaSolOcultoContainer: React.FC = () => {
  const navigate = useNavigate();
  const ref = query(collection(firestore, "enigma-sol-oculto-fichas"));
  const fichasQueryData = useFirestoreQueryData(
    ["enigma-sol-oculto-fichas"],
    ref,
    {
      subscribe: true,
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
        </EnigmaWrapper>
      );
  }
};

const EnigmaWrapper = styled(MainPageWrapper)`
  grid-template-areas: none;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
`;

const PersonagemWrapper = styled.div`
  border: 1px solid black;
  cursor: pointer;
`;

export default EnigmaSolOcultoContainer;
