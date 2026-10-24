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
import EncontrosMonstros from "./components/encontros-monstros.component";

export const COLECAO_LOBISOMEM = "uivo-do-lobisomem-fichas";

export type Monstro = {
  id: string;
  nome: string;
  habilidade: number;
  energia: number;
};

export type LobisomemStateProps = {
  Nome: string;
  habilidade: number;
  habilidadeInicial: number;
  energia: number;
  energiaInicial: number;
  sorte: number;
  sorteInicial: number;
  ouro: number;
  provisoes: number;
  transformacao: number;
  equipamento: Array<string>;
  notasESenhas: string;
  monstros: Array<Monstro>;
  ultimoParagrafo: string;
  morto: boolean;
};

const initialState: LobisomemStateProps = {
  Nome: "",
  habilidade: 0,
  habilidadeInicial: 0,
  energia: 0,
  energiaInicial: 0,
  sorte: 0,
  sorteInicial: 0,
  ouro: 0,
  provisoes: 0,
  transformacao: 0,
  equipamento: [],
  notasESenhas: "",
  monstros: [],
  ultimoParagrafo: "",
  morto: false
};

const LIMITE_CRITICO = 3;

const UivoDoLobisomemPersonagem: React.FC = () => {
  const { nomePersonagem } = useParams<{ nomePersonagem: string }>();

  const safeNomePersonagem = nomePersonagem ? nomePersonagem : "";
  const userId = auth.currentUser ? auth.currentUser.uid : "";
  const ref = doc(
    firestore,
    COLECAO_LOBISOMEM,
    `${userId}__${safeNomePersonagem}`
  );
  const {
    data: personagemData,
    isLoading: isLoadingPersonagem
  } = useFirestoreDocumentData(
    [COLECAO_LOBISOMEM, `${userId}__${safeNomePersonagem}`],
    ref,
    { subscribe: true }
  );

  const { mutateAsync: savePersonagem } = useFirestoreDocumentMutation(ref);

  const [personagem, setPersonagem] = useState<LobisomemStateProps>(
    initialState
  );

  const { status, online, queue, isDirty } = useAutoSave<LobisomemStateProps>(
    value => savePersonagem({ ...value, userId })
  );

  const update = (changes: Partial<LobisomemStateProps>) => {
    const atualizado = { ...personagem, ...changes };
    setPersonagem(atualizado);
    queue(atualizado);
  };

  useEffect(() => {
    // Enquanto houver mudança do jogador ainda não confirmada, o que chega do
    // servidor não sobrescreve a tela
    if (personagemData && !isDirty()) {
      // Fichas antigas podem não ter todos os campos
      setPersonagem({
        ...initialState,
        ...(personagemData as Partial<LobisomemStateProps>)
      });
    }
  }, [personagemData, isDirty]);

  if (isLoadingPersonagem) {
    return <Loading fullPage>Acendendo a lanterna</Loading>;
  }

  return (
    <Page $wide>
      <PageHeader
        back={{ to: "/uivo-do-lobisomem/personagem", label: "Aventureiros" }}
        eyebrow="Uivo do Lobisomem"
        title={personagem.Nome}
      />

      <PersonagemWrapper>
        <StatCounter
          id="habilidade"
          label="Habilidade"
          area="habilidade"
          min={0}
          value={personagem.habilidade}
          initial={personagem.habilidadeInicial}
          onChange={habilidade => update({ habilidade })}
        />

        <StatCounter
          id="energia"
          label="Energia"
          kind="vital"
          area="energia"
          min={0}
          value={personagem.energia}
          initial={personagem.energiaInicial}
          critical={personagem.energia <= LIMITE_CRITICO}
          onChange={energia => update({ energia })}
        />

        <StatCounter
          id="sorte"
          label="Sorte"
          kind="mind"
          area="sorte"
          min={0}
          value={personagem.sorte}
          initial={personagem.sorteInicial}
          onChange={sorte => update({ sorte })}
        />

        <StatCounter
          id="ouro"
          label="Ouro"
          kind="coin"
          area="ouro"
          min={0}
          value={personagem.ouro}
          onChange={ouro => update({ ouro })}
        />

        <StatCounter
          id="provisoes"
          label="Provisões"
          area="provisoes"
          min={0}
          value={personagem.provisoes}
          onChange={provisoes => update({ provisoes })}
        />

        <StatCounter
          id="transformacao"
          label="Transformação"
          kind="change"
          area="transformacao"
          min={0}
          value={personagem.transformacao}
          onChange={transformacao => update({ transformacao })}
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
          <FieldLabel htmlFor="campo-notas">Notas e senhas</FieldLabel>
          <FieldTextArea
            id="campo-notas"
            value={personagem.notasESenhas}
            onChange={e => update({ notasESenhas: e.target.value })}
          />
        </FieldWrapper>

        <EncontrosMonstros
          monstros={personagem.monstros}
          onChange={monstros => update({ monstros })}
        />

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
    "habilidade habilidade energia energia sorte sorte"
    "ouro ouro provisoes provisoes transformacao transformacao"
    "equipamento equipamento equipamento notas notas notas"
    "monstros monstros monstros monstros monstros monstros"
    "ultParagrafo ultParagrafo ultParagrafo status status status"
    "salvar salvar salvar salvar salvar salvar";
  gap: var(--space-lg);

  ${media.mobile} {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      "habilidade"
      "energia"
      "sorte"
      "ouro"
      "provisoes"
      "transformacao"
      "equipamento"
      "notas"
      "monstros"
      "ultParagrafo"
      "status"
      "salvar";
    gap: var(--space-md);
  }
`;

export default UivoDoLobisomemPersonagem;
