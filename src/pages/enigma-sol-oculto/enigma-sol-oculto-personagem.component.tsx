import {
  useFirestoreDocumentData,
  useFirestoreDocumentMutation
} from "@react-query-firebase/firestore";
import { doc } from "firebase/firestore";
import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth, firestore } from "../../firebase/firebase.utils";
import { ButtonCssStyle } from "../../theme/styles";
import { MainPageWrapper } from "../main/Main.container";
import Loading from "./components/loading-component";
import PersonagemArrayProp from "./components/personagem-array-prop.component";
import Notas from "./components/personagem-notas.component";
import PersonagemNumberProp from "./components/personagem-number-prop.component";
import Status from "./components/personagem-status.component";
import UltimoParagrafo from "./components/personagem-ultimo-paragrafo.component";

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
  const navigate = useNavigate();

  const safeNomePersonagem = nomePersonagem ? nomePersonagem : "";
  const userId = auth.currentUser ? auth.currentUser.uid : "";
  const ref = doc(
    firestore,
    "enigma-sol-oculto-fichas",
    `${userId}__${safeNomePersonagem}`
  );
  const {
    data: personagemData,
    isLoading: isLoadingPersonagem
  } = useFirestoreDocumentData(
    ["enigma-sol-oculto-fichas", `${userId}__${safeNomePersonagem}`],
    ref,
    { subscribe: true }
  );

  const {
    mutate: savePersonagem,
    isLoading: isLoadingSavePersonagem
  } = useFirestoreDocumentMutation(ref);

  const [personagem, setPersonagem] = useState<PersonagemStateProps>(
    initialState
  );

  const { Nome, ...restPersonagem } = personagem;

  useEffect(() => {
    if (personagemData) {
      setPersonagem({
        ...(personagemData as PersonagemStateProps)
      });
    }
  }, [personagemData]);

  if (isLoadingPersonagem || isLoadingSavePersonagem) {
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

      <Voltar onClick={() => navigate(-1)}>Voltar</Voltar>

      <SalvarPersonagem
        onClick={() =>
          savePersonagem({
            Nome,
            ...restPersonagem,
            userId
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
    "voltar voltar salvar salvar";
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
      "salvar"
      "voltar";
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

const Voltar = styled.button`
  grid-area: voltar;
  cursor: pointer;
  border: none;
  ${ButtonCssStyle}

  @media (max-width: 425px) {
    margin-top: 20px;
  }
`;

export default EnigmaSolOcultoPersonagem;
