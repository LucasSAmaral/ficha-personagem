import { useFirestoreDocumentData } from "@react-query-firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { MainPageWrapper } from "../main/Main.container";
import { doc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase.utils";
import { useParams } from "react-router-dom";
import PersonagemSaudeComponent from "./components/personagem-saude.component";
import PersonagemSanidadeComponent from "./components/personagem-sanidade.component";
import PersonagemDinheiroComponent from "./components/personagem-dinheiro.component";
import PersonagemTracosComponent from "./components/personagem-tracos.component";
import PersonagemEquipamentosComponent from "./components/personagem-equipamento.component";
import PersonagemNotasComponent from "./components/personagem-notas.component";

type PersonagemStateProps = {
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

export type PersonagemProps = {
  personagem: PersonagemStateProps;
  setPersonagem: React.Dispatch<React.SetStateAction<PersonagemStateProps>>;
};

const initialState: PersonagemStateProps = {
  Nome: "",
  dinheiro: 0,
  equipamento: [],
  morto: false,
  notas: "",
  sanidade: 0,
  saude: 0,
  tracos: [],
  ultimoParagrafo: ""
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

  const [personagem, setPersonagem] = useState<PersonagemStateProps>(
    initialState
  );

  useEffect(() => {
    if (personagemQueryResult.data) {
      setPersonagem({
        ...(personagemQueryResult.data as PersonagemStateProps)
      });
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
      <PersonagemSaudeComponent
        personagem={personagem}
        setPersonagem={setPersonagem}
      />
      <PersonagemSanidadeComponent
        personagem={personagem}
        setPersonagem={setPersonagem}
      />
      <PersonagemTracosComponent
        personagem={personagem}
        setPersonagem={setPersonagem}
      />
      <PersonagemEquipamentosComponent
        personagem={personagem}
        setPersonagem={setPersonagem}
      />
      <PersonagemDinheiroComponent
        personagem={personagem}
        setPersonagem={setPersonagem}
      />
      <PersonagemNotasComponent
        personagem={personagem}
        setPersonagem={setPersonagem}
      />
    </PersonagemWrapper>
  );
};

const PersonagemWrapper = styled(MainPageWrapper)`
  grid-template-areas:
    "nome nome nome nome"
    "saude saude sanidade sanidade"
    "tracos tracos equipamentos equipamentos"
    "dinheiro dinheiro notas notas";
  column-gap: 30px;
`;

const PersonagemNome = styled.h2`
  font-size: ${props => props.theme.titleFontSize};
  grid-area: nome;
`;

export default EnigmaSolOcultoPersonagem;
