import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import FormInputComponent, {
  ControlFormData
} from "../../components/FormInput.component";
import { MainPageWrapper } from "../main/Main.container";
import { doc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase.utils";
import { useFirestoreDocumentMutation } from "@react-query-firebase/firestore";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const CriarPersonagemContainer: React.FC = () => {
  const { control, handleSubmit } = useForm<ControlFormData>({
    mode: "onSubmit"
  });

  const navigate = useNavigate();

  const [novoNome, setNovoNome] = useState("inicial");

  const userId = Cookies.get("userId");

  const safeUserId = userId ? userId : "";

  const safeNovoNome = novoNome.replace(" ", "_");

  const ref = doc(
    firestore,
    "enigma-sol-oculto-fichas",
    `${safeUserId}__${safeNovoNome}`
  );

  const personagemMutation = useFirestoreDocumentMutation(ref);

  const onSubmit = handleSubmit(formData => {
    if (
      "Nome" in formData &&
      "dinheiro" in formData &&
      "sanidade" in formData &&
      "saude" in formData
    ) {
      const { Nome, dinheiro, sanidade, saude } = formData;

      setNovoNome(Nome);

      const userId = Cookies.get("userId");
      const safeUserId = userId ? userId : "";

      personagemMutation.mutate(
        {
          Nome,
          dinheiro: parseInt(dinheiro),
          equipamento: [],
          morto: false,
          notas: "",
          sanidade: parseInt(sanidade),
          saude: parseInt(saude),
          tracos: [],
          ultimoParagrafo: "",
          userId: safeUserId
        },
        {
          onSuccess: () => {
            navigate("/enigma-sol-oculto/personagem");
          },
          onError: () => {
            alert("Erro ao criar personagem");
          }
        }
      );
    }
  });

  return (
    <CriarPersonagemWrapper>
      <CriarPersonagemTitle>Criar Personagem</CriarPersonagemTitle>
      <CriarPersonagemForm onSubmit={onSubmit}>
        <FormInputComponent
          control={control}
          name="Nome"
          label="Nome do Personagem"
          type="text"
          required
        />

        <FormInputComponent
          control={control}
          name="saude"
          label="Saúde"
          type="number"
          required
        />

        <FormInputComponent
          control={control}
          name="sanidade"
          label="Sanidade"
          type="number"
          required
        />

        <FormInputComponent
          control={control}
          name="dinheiro"
          label="Dinheiro"
          type="number"
          required
        />
        {personagemMutation.isLoading && "Loading..."}
        <CriarPersonagemButton type="submit">
          Criar Personagem
        </CriarPersonagemButton>
      </CriarPersonagemForm>
    </CriarPersonagemWrapper>
  );
};

const CriarPersonagemWrapper = styled(MainPageWrapper)`
  grid-template-areas:
    "title"
    "form";
  grid-template-rows: 60px 350px;
`;

const CriarPersonagemTitle = styled.h2`
  font-size: ${props => props.theme.titleFontSize};
  grid-area: title;
`;

const CriarPersonagemForm = styled.form`
  grid-area: form;
`;

const CriarPersonagemButton = styled.button`
  cursor: pointer;
`;

export default CriarPersonagemContainer;
