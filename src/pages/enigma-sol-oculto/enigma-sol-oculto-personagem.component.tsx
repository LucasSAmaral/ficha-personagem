import { useFirestoreDocumentData } from "@react-query-firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { MainPageWrapper } from "../main/Main.container";
import { doc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase.utils";
import { useParams } from "react-router-dom";

type personagemStateType = {
  Nome: string;
  dinheiro: number;
  equipamento: Array<string>;
  morto: boolean;
  notas: string;
  sanidade: number;
  saude: number;
  tracos: Array<string>;
  ultimoParagrafo: string;
};

const initialState: personagemStateType = {
  Nome: "",
  dinheiro: 0,
  equipamento: [],
  morto: false,
  notas: "",
  sanidade: 0,
  saude: 0,
  tracos: [],
  ultimoParagrafo: "",
};

const EnigmaSolOcultoPersonagem: React.FC = () => {
  const { nomePersonagem } = useParams<{ nomePersonagem: string }>();
  const safeNomePersonagem = nomePersonagem ? nomePersonagem : "";
  const ref = doc(firestore, "enigma-sol-oculto-fichas", safeNomePersonagem);
  const personagemQueryResult = useFirestoreDocumentData(
    ["enigma-sol-oculto-fichas", safeNomePersonagem],
    ref,
    { subscribe: true }
  );

  const [personagem, setPersonagem] = useState<personagemStateType>(
    initialState
  );

  useEffect(() => {
    if (personagemQueryResult.data) {
      setPersonagem({ ...(personagemQueryResult.data as personagemStateType) });
    }
    // @ts-ignore
  }, [personagemQueryResult.data]);

  console.log("personagem", personagem);

  if (personagemQueryResult.isLoading) {
    return <>Loading...</>;
  }

  return (
    <PersonagemWrapper>
      <PersonagemNome>{personagem.Nome}</PersonagemNome>
      <PersonagemSaude>Saúde</PersonagemSaude>
      <PersonagemSanidade>Sanidade</PersonagemSanidade>
      <PersonagemTracos>Traços</PersonagemTracos>
      <PersonagemEquipamentos>Equipamentos</PersonagemEquipamentos>
      <PersonagemDinheiro>Dinheiro</PersonagemDinheiro>
      <PersonagemNotas>Notas</PersonagemNotas>
    </PersonagemWrapper>
  );
};

const PersonagemWrapper = styled(MainPageWrapper)`
  grid-template-areas:
    "nome nome nome nome"
    "saude saude sanidade sanidade"
    "tracos tracos equipamentos equipamentos"
    "dinheiro dinheiro notas notas";
`;

const PersonagemNome = styled.h2`
  font-size: ${(props) => props.theme.titleFontSize};
  grid-area: nome;
`;

const PersonagemSaude = styled.div`
  grid-area: saude;
`;

const PersonagemSanidade = styled.div`
  grid-area: sanidade;
`;

const PersonagemTracos = styled.div`
  grid-area: tracos;
`;

const PersonagemEquipamentos = styled.div`
  grid-area: equipamentos;
`;

const PersonagemDinheiro = styled.div`
  grid-area: dinheiro;
`;

const PersonagemNotas = styled.div`
  grid-area: notas;
`;

export default EnigmaSolOcultoPersonagem;
