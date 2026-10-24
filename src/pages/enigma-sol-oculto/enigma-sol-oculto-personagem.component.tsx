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
import {
  FieldInput,
  FieldLabel,
  FieldTextArea,
  FieldWrapper
} from "../../components/FormInput.component";
import ListField from "../../components/ListField.component";
import Loading from "../../components/Loading.component";
import Page from "../../components/Page.component";
import PageHeader from "../../components/PageHeader.component";
import StatCounter from "../../components/StatCounter.component";
import StatusToggle from "../../components/StatusToggle.component";
import { auth, firestore } from "../../firebase/firebase.utils";
import { media } from "../../theme/tokens";

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

const LIMITE_CRITICO = 3;

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

  const update = (changes: Partial<PersonagemStateProps>) =>
    setPersonagem({ ...personagem, ...changes });

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
        <StatCounter
          id="saude"
          label="Saúde"
          kind="vital"
          area="saude"
          value={personagem.saude}
          critical={personagem.saude <= LIMITE_CRITICO}
          onChange={saude => update({ saude })}
        />

        <StatCounter
          id="sanidade"
          label="Sanidade"
          kind="mind"
          area="sanidade"
          value={personagem.sanidade}
          critical={personagem.sanidade <= LIMITE_CRITICO}
          onChange={sanidade => update({ sanidade })}
        />

        <StatCounter
          id="dinheiro"
          label="Libras"
          kind="coin"
          area="dinheiro"
          value={personagem.dinheiro}
          onChange={dinheiro => update({ dinheiro })}
        />

        <ListField
          id="tracos"
          title="Traços"
          itemLabel="traço"
          area="tracos"
          items={personagem.tracos}
          onChange={tracos => update({ tracos })}
        />

        <ListField
          id="equipamento"
          title="Equipamento"
          itemLabel="item"
          area="equipamento"
          items={personagem.equipamento}
          onChange={equipamento => update({ equipamento })}
        />

        <FieldWrapper $area="notas">
          <FieldLabel htmlFor="campo-notas">Notas</FieldLabel>
          <FieldTextArea
            id="campo-notas"
            value={personagem.notas}
            onChange={e => update({ notas: e.target.value })}
          />
        </FieldWrapper>

        <FieldWrapper $area="ultParagrafo">
          <FieldLabel htmlFor="campo-ultimo-paragrafo">
            Último parágrafo
          </FieldLabel>
          <FieldInput
            id="campo-ultimo-paragrafo"
            type="text"
            inputMode="numeric"
            value={personagem.ultimoParagrafo}
            onChange={e => update({ ultimoParagrafo: e.target.value })}
          />
        </FieldWrapper>

        <StatusToggle
          area="status"
          morto={personagem.morto}
          onChange={morto => update({ morto })}
        />

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
