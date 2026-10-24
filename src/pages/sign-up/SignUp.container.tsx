import React, { useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import Button from "../../components/Button.component";
import FormInputComponent, {
  ControlFormData
} from "../../components/FormInput.component";
import Page from "../../components/Page.component";
import PageHeader from "../../components/PageHeader.component";
import { auth, firestore } from "../../firebase/firebase.utils";
import { useAuthCreateUserWithEmailAndPassword } from "@react-query-firebase/auth";
import { useFirestoreDocumentMutation } from "@react-query-firebase/firestore";
import { collection, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const SignUpContainer: React.FC = () => {
  const { control, handleSubmit } = useForm<ControlFormData>({
    mode: "onSubmit"
  });

  const navigate = useNavigate();

  const [userUid, setUserUid] = useState("inicial");

  const [erroSenha, setErroSenha] = useState("");

  const [erro, setErro] = useState("");

  const {
    mutate: authMutate,
    isLoading
  } = useAuthCreateUserWithEmailAndPassword(auth);

  const collectionRef = collection(firestore, "users");

  const ref = doc(collectionRef, userUid);

  const { mutate: documentMutate } = useFirestoreDocumentMutation(ref);

  const onSubmit = handleSubmit(formData => {
    if (
      "password" in formData &&
      "confirmPassword" in formData &&
      "email" in formData &&
      "displayName" in formData
    ) {
      const { password, confirmPassword, email, displayName } = formData;

      setErro("");

      if (password !== confirmPassword) {
        setErroSenha(
          "As senhas não são iguais. Digite a mesma senha nos dois campos."
        );
        return;
      }

      setErroSenha("");

      authMutate(
        { email, password },
        {
          onSuccess: ({ user }) => {
            const createdAt = new Date();
            setUserUid(user.uid);

            documentMutate(
              { displayName, email, createdAt },
              {
                onSuccess: () => {
                  navigate("/");
                }
              }
            );
          },
          onError: () => {
            setErro(
              "Não foi possível criar a conta. Confira o e-mail e use uma senha com pelo menos 6 caracteres."
            );
          }
        }
      );
    }
  });

  return (
    <Page>
      <PageHeader back={{ to: "/login", label: "Entrar" }} title="Criar conta" />
      <SignUpForm onSubmit={onSubmit}>
        <FormInputComponent
          control={control}
          name="displayName"
          label="Nome de exibição"
          type="text"
          autoComplete="nickname"
          required
        />

        <FormInputComponent
          control={control}
          name="email"
          label="E-mail"
          type="email"
          autoComplete="email"
          required
        />

        <FormInputComponent
          control={control}
          name="password"
          label="Senha"
          type="password"
          autoComplete="new-password"
          required
        />

        <FormInputComponent
          control={control}
          name="confirmPassword"
          label="Confirmar senha"
          type="password"
          autoComplete="new-password"
          required
          error={erroSenha}
        />

        {erro && <ErrorMessage role="alert">{erro}</ErrorMessage>}

        <SignUpButton type="submit" disabled={isLoading}>
          {isLoading ? "Criando conta…" : "Criar conta"}
        </SignUpButton>
      </SignUpForm>
    </Page>
  );
};

const SignUpForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const ErrorMessage = styled.p`
  color: var(--danger);
`;

const SignUpButton = styled(Button)`
  align-self: center;
  margin-top: var(--space-xs);
`;

export default SignUpContainer;
