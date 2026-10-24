import { useFirestoreDocumentMutation } from "@react-query-firebase/firestore";
import { doc } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../../../components/Button.component";
import FormInputComponent, {
  ControlFormData
} from "../../../components/FormInput.component";
import Page from "../../../components/Page.component";
import PageHeader from "../../../components/PageHeader.component";
import { auth, firestore } from "../../../firebase/firebase.utils";
import { media } from "../../../theme/tokens";
import {
  COLECAO_LOBISOMEM,
  LobisomemStateProps
} from "../uivo-do-lobisomem-personagem.component";

const CriarPersonagemContainer: React.FC = () => {
  const { control, handleSubmit } = useForm<ControlFormData>({
    mode: "onSubmit"
  });

  const navigate = useNavigate();

  const [novoNome, setNovoNome] = useState("inicial");

  const [erro, setErro] = useState("");

  const userId = auth.currentUser ? auth.currentUser.uid : "";

  const safeNovoNome = novoNome.replace(" ", "_");

  const ref = doc(firestore, COLECAO_LOBISOMEM, `${userId}__${safeNovoNome}`);

  const { isLoading, mutate: createPersonagem } = useFirestoreDocumentMutation(
    ref
  );

  const onSubmit = handleSubmit(formData => {
    if (
      "Nome" in formData &&
      "habilidade" in formData &&
      "energia" in formData &&
      "sorte" in formData &&
      "ouro" in formData &&
      "provisoes" in formData
    ) {
      const habilidade = Number.parseInt(formData.habilidade);
      const energia = Number.parseInt(formData.energia);
      const sorte = Number.parseInt(formData.sorte);

      const novoPersonagem: LobisomemStateProps = {
        Nome: formData.Nome,
        habilidade,
        habilidadeInicial: habilidade,
        energia,
        energiaInicial: energia,
        sorte,
        sorteInicial: sorte,
        ouro: Number.parseInt(formData.ouro),
        provisoes: Number.parseInt(formData.provisoes),
        transformacao: 0,
        equipamento: [],
        notasESenhas: "",
        monstros: [],
        ultimoParagrafo: "",
        morto: false
      };

      setNovoNome(formData.Nome);
      setErro("");

      createPersonagem(
        { ...novoPersonagem, userId },
        {
          onSuccess: () => {
            navigate("/uivo-do-lobisomem/personagem");
          },
          onError: () => {
            setErro(
              "Não foi possível criar o aventureiro. Verifique a conexão e tente de novo."
            );
          }
        }
      );
    }
  });

  return (
    <Page>
      <PageHeader
        back={{ to: "/uivo-do-lobisomem/personagem", label: "Aventureiros" }}
        eyebrow="Uivo do Lobisomem"
        title="Novo aventureiro"
      />
      <CriarPersonagemIntro>
        Role os dados como o livro manda e anote os valores. Eles também ficam
        guardados como valores iniciais.
      </CriarPersonagemIntro>
      <CriarPersonagemForm onSubmit={onSubmit}>
        <FormInputComponent
          control={control}
          name="Nome"
          label="Nome do aventureiro"
          type="text"
          required
        />

        <CriarPersonagemStats>
          <FormInputComponent
            control={control}
            name="habilidade"
            label="Habilidade"
            type="number"
            inputMode="numeric"
            required
          />

          <FormInputComponent
            control={control}
            name="energia"
            label="Energia"
            type="number"
            inputMode="numeric"
            required
          />

          <FormInputComponent
            control={control}
            name="sorte"
            label="Sorte"
            type="number"
            inputMode="numeric"
            required
          />

          <FormInputComponent
            control={control}
            name="ouro"
            label="Ouro"
            type="number"
            inputMode="numeric"
            required
          />

          <FormInputComponent
            control={control}
            name="provisoes"
            label="Provisões"
            type="number"
            inputMode="numeric"
            required
          />
        </CriarPersonagemStats>

        {erro && <ErrorMessage role="alert">{erro}</ErrorMessage>}

        <CriarPersonagemButton type="submit" disabled={isLoading}>
          {isLoading ? "Criando…" : "Criar aventureiro"}
        </CriarPersonagemButton>
      </CriarPersonagemForm>
    </Page>
  );
};

const CriarPersonagemIntro = styled.p`
  color: var(--ink-muted);
`;

const CriarPersonagemForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const CriarPersonagemStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-md);

  ${media.mobile} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const ErrorMessage = styled.p`
  color: var(--danger);
`;

const CriarPersonagemButton = styled(Button)`
  align-self: center;
  margin-top: var(--space-xs);
`;

export default CriarPersonagemContainer;
