import React, { useState } from "react";
import styled from "styled-components";
import { MainPageWrapper } from "../main/Main.container";
import { useForm } from "react-hook-form";
import FormInputComponent, {
  ControlFormData,
  FormData
} from "../../components/FormInput.component";
import { auth, firestore } from "../../firebase/firebase.utils";
import { useAuthCreateUserWithEmailAndPassword } from "@react-query-firebase/auth";
import { useFirestoreDocumentMutation } from "@react-query-firebase/firestore";
import { collection, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const SignUpContainer: React.FC = () => {
  const { control, handleSubmit } = useForm<ControlFormData>({
    mode: "onSubmit"
  });

  const navigate = useNavigate();

  const [userUid, setUserUid] = useState("inicial");

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
      "confirmPassword" &&
      "email" in formData &&
      "displayName" in formData
    ) {
      const { password, confirmPassword, email, displayName } = formData;

      if (password !== confirmPassword) {
        alert("Senhas não são iguais");
      }

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
                  Cookies.set("userId", user.uid);
                  navigate("/");
                }
              }
            );
          },
          onError: () => {
            alert("Erro ao cadastrar");
          }
        }
      );
    }
  });

  return (
    <SignUpWrapper>
      <SignUpTitle>Cadastro</SignUpTitle>
      <SignUpForm onSubmit={onSubmit}>
        <FormInputComponent
          control={control}
          name="displayName"
          label="Display Name"
          type="text"
          required
        />

        <FormInputComponent
          control={control}
          name="email"
          label="E-mail"
          type="email"
          required
        />

        <FormInputComponent
          control={control}
          name="password"
          label="Password"
          type="password"
          required
        />

        <FormInputComponent
          control={control}
          name="confirmPassword"
          label="Confirmar Password"
          type="password"
          required
        />
        {isLoading && "Loading..."}
        <SignUpButton type="submit">Cadastrar</SignUpButton>
      </SignUpForm>
    </SignUpWrapper>
  );
};

const SignUpWrapper = styled(MainPageWrapper)`
  grid-template-areas:
    "title"
    "form";
  grid-template-rows: 60px 350px;
`;

const SignUpTitle = styled.h2`
  font-size: ${props => props.theme.titleFontSize};
  grid-area: title;
`;

const SignUpForm = styled.form`
  grid-area: form;
`;

const SignUpButton = styled.button``;

export default SignUpContainer;
