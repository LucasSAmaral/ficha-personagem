import {
  useFirestoreDocumentData,
  useFirestoreDocumentMutation
} from "@react-query-firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { MainPageWrapper } from "../main/Main.container";
import { doc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase.utils";
import { useParams } from "react-router-dom";
import Saude from "./components/personagem-saude.component";
import Sanidade from "./components/personagem-sanidade.component";
import Dinheiro from "./components/personagem-dinheiro.component";
import Tracos from "./components/personagem-tracos.component";
import Equipamentos from "./components/personagem-equipamento.component";
import Notas from "./components/personagem-notas.component";
import UltimoParagrafo from "./components/personagem-ultimo-paragrafo.component";
import Status from "./components/personagem-status.component";

export type PersonagemStateProps = {
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

  const personagemMutation = useFirestoreDocumentMutation(ref);

  const [personagem, setPersonagem] = useState<PersonagemStateProps>(
    initialState
  );

  const {
    Nome,
    dinheiro,
    equipamento,
    morto,
    notas,
    sanidade,
    saude,
    tracos,
    ultimoParagrafo
  } = personagem;

  useEffect(() => {
    if (personagemQueryResult.data) {
      setPersonagem({
        ...(personagemQueryResult.data as PersonagemStateProps)
      });
    }
    // @ts-ignore
  }, [personagemQueryResult.data]);

  if (personagemQueryResult.isLoading || personagemMutation.isLoading) {
    return <>Loading...</>;
  }

  return (
    <PersonagemWrapper>
      <PersonagemNome>{Nome}</PersonagemNome>
      <Saude personagem={personagem} setPersonagem={setPersonagem} />
      <Sanidade personagem={personagem} setPersonagem={setPersonagem} />
      <Tracos personagem={personagem} setPersonagem={setPersonagem} />
      <Equipamentos personagem={personagem} setPersonagem={setPersonagem} />
      <Dinheiro personagem={personagem} setPersonagem={setPersonagem} />
      <Notas personagem={personagem} setPersonagem={setPersonagem} />
      <Status personagem={personagem} setPersonagem={setPersonagem} />
      <UltimoParagrafo personagem={personagem} setPersonagem={setPersonagem} />
      <SalvarPersonagem
        onClick={() =>
          personagemMutation.mutate({
            Nome,
            dinheiro,
            equipamento,
            morto,
            notas,
            sanidade,
            saude,
            tracos,
            ultimoParagrafo
          })
        }
      >
        Salvar Personagem
      </SalvarPersonagem>
    </PersonagemWrapper>
  );
};

const PersonagemWrapper = styled(MainPageWrapper)`
  grid-template-areas:
    "nome nome nome nome"
    "saude saude sanidade sanidade"
    "tracos tracos equipamentos equipamentos"
    "notas notas ultParagrafo ultParagrafo"
    "dinheiro dinheiro status status"
    ". salvar salvar .";
  column-gap: 30px;
  padding-top: 0;
`;

const PersonagemNome = styled.h2`
  font-size: ${props => props.theme.titleFontSize};
  grid-area: nome;
`;

const SalvarPersonagem = styled.button`
  grid-area: salvar;
  cursor: pointer;
  padding: 10px 0px;
`;

export default EnigmaSolOcultoPersonagem;
