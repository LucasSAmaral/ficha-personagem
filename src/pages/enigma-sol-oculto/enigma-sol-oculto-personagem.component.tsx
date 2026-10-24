import {
  useFirestoreDocumentData,
  useFirestoreDocumentMutation
} from "@react-query-firebase/firestore";
import { doc } from "firebase/firestore";
import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import AutoSaveStatus from "../../components/AutoSaveStatus.component";
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
import useAutoSave from "../../hooks/useAutoSave";
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

  const { mutateAsync: savePersonagem } = useFirestoreDocumentMutation(ref);

  const [personagem, setPersonagem] = useState<PersonagemStateProps>(
    initialState
  );

  const { status, online, queue, isDirty } = useAutoSave<PersonagemStateProps>(
    value => savePersonagem({ ...value, userId })
  );

  const update = (changes: Partial<PersonagemStateProps>) => {
    const atualizado = { ...personagem, ...changes };
    setPersonagem(atualizado);
    queue(atualizado);
  };

  useEffect(() => {
    // Enquanto houver mudança do jogador ainda não confirmada, o que chega do
    // servidor não sobrescreve a tela
    if (personagemData && !isDirty()) {
      setPersonagem({
        ...(personagemData as PersonagemStateProps)
      });
    }
  }, [personagemData, isDirty]);

  if (isLoadingPersonagem) {
    return <Loading fullPage>Abrindo o dossiê</Loading>;
  }

  return (
    <Page $wide>
      <PageHeader
        back={{ to: "/enigma-sol-oculto/personagem", label: "Investigadores" }}
        eyebrow="O Enigma do Sol Oculto"
        title={personagem.Nome}
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

        <AutoSaveStatus status={status} online={online} />
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

export default EnigmaSolOcultoPersonagem;
