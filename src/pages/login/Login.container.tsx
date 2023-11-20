import { useAuthSignInWithEmailAndPassword } from "@react-query-firebase/auth";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import FormInputComponent, {
  ControlFormData
} from "../../components/FormInput.component";
import { auth } from "../../firebase/firebase.utils";
import { ButtonCssStyle } from "../../theme/styles";
import { MainPageWrapper } from "../main/Main.container";

const LoginContainer: React.FC = () => {
  const { control, handleSubmit } = useForm<ControlFormData>({
    mode: "onSubmit"
  });
  const { mutate: LoginUser } = useAuthSignInWithEmailAndPassword(auth);

  const navigate = useNavigate();

  const onSubmit = handleSubmit(formData => {
    if ("email" in formData && "password" in formData) {
      const { email, password } = formData;
      LoginUser(
        { email, password },
        {
          onSuccess: () => {
            navigate("/");
          },
          onError: () => {
            alert("Erro ao logar");
          }
        }
      );
    }
  });
  return (
    <LoginWrapper>
      <LoginTitle>Login</LoginTitle>
      <LoginForm onSubmit={onSubmit}>
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

        <LoginButton type="submit">Entrar</LoginButton>
      </LoginForm>

      <SignUpLink to="/sign-up">Cadastre-se</SignUpLink>
    </LoginWrapper>
  );
};

const LoginWrapper = styled(MainPageWrapper)`
  grid-template-areas:
    "title"
    "form"
    "signUpButton";
  grid-template-rows: 60px 350px;
`;

const LoginTitle = styled.h2`
  font-size: ${props => props.theme.titleFontSize};
  grid-area: title;
`;

const LoginForm = styled.form`
  grid-area: form;
`;

const LoginButton = styled.button`
  ${ButtonCssStyle}
  border: none;
  cursor: pointer;
`;

const SignUpLink = styled(Link)`
  grid-area: signUpButton;
  ${ButtonCssStyle}
`;

export default LoginContainer;
