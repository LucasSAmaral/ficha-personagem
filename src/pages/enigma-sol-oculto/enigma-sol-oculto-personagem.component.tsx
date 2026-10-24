import {
  useFirestoreDocumentData,
  useFirestoreDocumentMutation
} from "@react-query-firebase/firestore";
import { doc } from "firebase/firestore";
import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../../components/Button.component";
import Loading from "../../components/Loading.component";
import Page from "../../components/Page.component";
import PageHeader from "../../components/PageHeader.component";
import { auth, firestore } from "../../firebase/firebase.utils";
import { media } from "../../theme/tokens";
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

type SaveStatus = "idle" | "saved" | "error";

const EnigmaSolOcultoPersonagem: React.FC = () => {
  const { nomePersonagem } = useParams<{ nomePersonagem: string }>();

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

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const { Nome, ...restPersonagem } = personagem;

  useEffect(() => {
    if (personagemData) {
      setPersonagem({
        ...(personagemData as PersonagemStateProps)
      });
    }
  }, [personagemData]);

  useEffect(() => {
    setSaveStatus("idle");
  }, [personagem]);

  if (isLoadingPersonagem) {
    return <Loading fullPage>Abrindo o dossiê</Loading>;
  }

  const onSave = () =>
    savePersonagem(
      {
        Nome,
        ...restPersonagem,
        userId
      },
      {
        onSuccess: () => setSaveStatus("saved"),
        onError: () => setSaveStatus("error")
      }
    );

  return (
    <Page $wide>
      <PageHeader
        back={{ to: "/enigma-sol-oculto/personagem", label: "Investigadores" }}
        eyebrow="O Enigma do Sol Oculto"
        title={Nome}
      />

      <PersonagemWrapper>
        <PersonagemNumberProp
          personagem={personagem}
          setPersonagem={setPersonagem}
          title="Saúde"
          prop="saude"
        />

        <PersonagemNumberProp
          personagem={personagem}
          setPersonagem={setPersonagem}
          title="Sanidade"
          prop="sanidade"
        />

        <PersonagemNumberProp
          personagem={personagem}
          setPersonagem={setPersonagem}
          title="Libras"
          prop="dinheiro"
        />

        <PersonagemArrayProp
          personagem={personagem}
          setPersonagem={setPersonagem}
          title="Traços"
          prop="tracos"
        />

        <PersonagemArrayProp
          personagem={personagem}
          setPersonagem={setPersonagem}
          title="Equipamento"
          prop="equipamento"
        />

        <Notas personagem={personagem} setPersonagem={setPersonagem} />

        <UltimoParagrafo personagem={personagem} setPersonagem={setPersonagem} />

        <Status personagem={personagem} setPersonagem={setPersonagem} />

        <SalvarPersonagem>
          <Button
            type="button"
            disabled={isLoadingSavePersonagem}
            onClick={onSave}
          >
            {isLoadingSavePersonagem ? "Salvando…" : "Salvar ficha"}
          </Button>
          <SaveMessage role="status" $error={saveStatus === "error"}>
            {saveStatus === "saved" && "Ficha salva."}
            {saveStatus === "error" &&
              "Não foi possível salvar a ficha. Verifique a conexão e tente de novo."}
          </SaveMessage>
        </SalvarPersonagem>
      </PersonagemWrapper>
    </Page>
  );
};

const PersonagemWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  grid-template-areas:
    "saude saude sanidade sanidade dinheiro dinheiro"
    "tracos tracos tracos equipamento equipamento equipamento"
    "notas notas notas notas notas notas"
    "ultParagrafo ultParagrafo ultParagrafo status status status"
    "salvar salvar salvar salvar salvar salvar";
  gap: var(--space-lg);

  ${media.mobile} {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      "saude"
      "sanidade"
      "dinheiro"
      "tracos"
      "equipamento"
      "notas"
      "ultParagrafo"
      "status"
      "salvar";
    gap: var(--space-md);
  }
`;

const SalvarPersonagem = styled.div`
  grid-area: salvar;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  padding-top: var(--space-md);
  border-top: 1px solid var(--hairline);
`;

const SaveMessage = styled.p<{ $error: boolean }>`
  min-height: 20px;
  font-size: 15px;
  line-height: 20px;
  text-align: center;
  color: ${({ $error }) => ($error ? "var(--danger)" : "var(--ink-muted)")};
`;

export default EnigmaSolOcultoPersonagem;
