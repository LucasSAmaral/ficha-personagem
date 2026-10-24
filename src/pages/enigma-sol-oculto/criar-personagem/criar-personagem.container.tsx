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

const CriarPersonagemContainer: React.FC = () => {
  const { control, handleSubmit } = useForm<ControlFormData>({
    mode: "onSubmit"
  });

  const navigate = useNavigate();

  const [novoNome, setNovoNome] = useState("inicial");

  const [erro, setErro] = useState("");

  const userId = auth.currentUser ? auth.currentUser.uid : "";

  const safeNovoNome = novoNome.replace(" ", "_");

  const ref = doc(
    firestore,
    "enigma-sol-oculto-fichas",
    `${userId}__${safeNovoNome}`
  );

  const { isLoading, mutate: createPersonagem } = useFirestoreDocumentMutation(
    ref
  );

  const onSubmit = handleSubmit(formData => {
    if (
      "Nome" in formData &&
      "dinheiro" in formData &&
      "sanidade" in formData &&
      "saude" in formData
    ) {
      const { Nome, dinheiro, sanidade, saude } = formData;

      setNovoNome(Nome);
      setErro("");

      createPersonagem(
        {
          Nome,
          dinheiro: Number.parseInt(dinheiro),
          equipamento: [],
          morto: false,
          notas: "",
          sanidade: Number.parseInt(sanidade),
          saude: Number.parseInt(saude),
          tracos: [],
          ultimoParagrafo: "",
          userId
        },
        {
          onSuccess: () => {
            navigate("/enigma-sol-oculto/personagem");
          },
          onError: () => {
            setErro(
              "Não foi possível criar o investigador. Verifique a conexão e tente de novo."
            );
          }
        }
      );
    }
  });

  return (
    <Page>
      <PageHeader
        back={{ to: "/enigma-sol-oculto/personagem", label: "Investigadores" }}
        eyebrow="O Enigma do Sol Oculto"
        title="Novo investigador"
      />
      <CriarPersonagemForm onSubmit={onSubmit}>
        <FormInputComponent
          control={control}
          name="Nome"
          label="Nome do investigador"
          type="text"
          required
        />

        <CriarPersonagemStats>
          <FormInputComponent
            control={control}
            name="saude"
            label="Saúde"
            type="number"
            inputMode="numeric"
            required
          />

          <FormInputComponent
            control={control}
            name="sanidade"
            label="Sanidade"
            type="number"
            inputMode="numeric"
            required
          />

          <FormInputComponent
            control={control}
            name="dinheiro"
            label="Libras"
            type="number"
            inputMode="numeric"
            required
          />
        </CriarPersonagemStats>

        {erro && <ErrorMessage role="alert">{erro}</ErrorMessage>}

        <CriarPersonagemButton type="submit" disabled={isLoading}>
          {isLoading ? "Criando…" : "Criar investigador"}
        </CriarPersonagemButton>
      </CriarPersonagemForm>
    </Page>
  );
};

const CriarPersonagemForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const CriarPersonagemStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--space-md);
`;

const ErrorMessage = styled.p`
  color: var(--danger);
`;

const CriarPersonagemButton = styled(Button)`
  align-self: center;
  margin-top: var(--space-xs);
`;

export default CriarPersonagemContainer;
