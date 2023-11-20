import {
  useFirestoreDocumentData,
  useFirestoreDocumentMutation
} from "@react-query-firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { MainPageWrapper } from "../main/Main.container";
import { doc } from "firebase/firestore";
import { auth, firestore } from "../../firebase/firebase.utils";
import { useParams } from "react-router-dom";
import PersonagemNumberProp from "./components/personagem-number-prop.component";
import PersonagemArrayProp from "./components/personagem-array-prop.component";
import Notas from "./components/personagem-notas.component";
import UltimoParagrafo from "./components/personagem-ultimo-paragrafo.component";
import Status from "./components/personagem-status.component";
import Loading from "./components/loading-component";
import { ButtonCssStyle } from "../../theme/styles";

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
  const userId = auth.currentUser ? auth.currentUser.uid : "";
  const ref = doc(
    firestore,
    "enigma-sol-oculto-fichas",
    `${userId}__${safeNomePersonagem}`
  );
  const personagemQueryResult = useFirestoreDocumentData(
    ["enigma-sol-oculto-fichas", `${userId}__${safeNomePersonagem}`],
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
    return <Loading>Loading...</Loading>;
  }

  return (
    <PersonagemWrapper>
      <PersonagemNome>{Nome}</PersonagemNome>

      <PersonagemNumberProp
        personagem={personagem}
        setPersonagem={setPersonagem}
        title="Saúde Atual:"
        prop="saude"
      />

      <PersonagemNumberProp
        personagem={personagem}
        setPersonagem={setPersonagem}
        title="Sanidade Atual:"
        prop="sanidade"
      />

      <PersonagemArrayProp
        personagem={personagem}
        setPersonagem={setPersonagem}
        title="Traços:"
        prop="tracos"
      />

      <PersonagemArrayProp
        personagem={personagem}
        setPersonagem={setPersonagem}
        title="Equipamentos:"
        prop="equipamento"
      />

      <PersonagemNumberProp
        personagem={personagem}
        setPersonagem={setPersonagem}
        title="Libras:"
        prop="dinheiro"
      />

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
    "tracos tracos equipamento equipamento"
    "notas notas ultParagrafo ultParagrafo"
    "dinheiro dinheiro status status"
    ". salvar salvar .";
  column-gap: 30px;
  padding-top: 0;
  grid-template-rows: auto;

  @media (max-width: 425px) {
    grid-template-areas:
      "nome"
      "saude"
      "sanidade"
      "tracos"
      "equipamento"
      "notas"
      "ultParagrafo"
      "dinheiro"
      "status"
      "salvar";
    justify-content: center;
    margin-bottom: 50px;
  }
`;

const PersonagemNome = styled.h2`
  font-size: ${props => props.theme.titleFontSize};
  grid-area: nome;
`;

const SalvarPersonagem = styled.button`
  grid-area: salvar;
  cursor: pointer;
  border: none;
  ${ButtonCssStyle}

  @media (max-width: 425px) {
    margin-top: 20px;
  }
`;

export default EnigmaSolOcultoPersonagem;
