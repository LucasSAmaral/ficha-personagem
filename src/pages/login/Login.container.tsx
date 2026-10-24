import { useAuthSignInWithEmailAndPassword } from "@react-query-firebase/auth";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button, { ButtonLink } from "../../components/Button.component";
import FormInputComponent, {
  ControlFormData
} from "../../components/FormInput.component";
import Page from "../../components/Page.component";
import PageHeader from "../../components/PageHeader.component";
import { auth } from "../../firebase/firebase.utils";

const LoginContainer: React.FC = () => {
  const { control, handleSubmit } = useForm<ControlFormData>({
    mode: "onSubmit"
  });
  const { mutate: LoginUser, isLoading } = useAuthSignInWithEmailAndPassword(
    auth
  );

  const [erro, setErro] = useState("");

  const navigate = useNavigate();

  const onSubmit = handleSubmit(formData => {
    if ("email" in formData && "password" in formData) {
      const { email, password } = formData;
      setErro("");
      LoginUser(
        { email, password },
        {
          onSuccess: () => {
            navigate("/");
          },
          onError: () => {
            setErro("E-mail ou senha incorretos. Confira e tente de novo.");
          }
        }
      );
    }
  });
  return (
    <Page>
      <PageHeader back={{ to: "/", label: "Início" }} title="Entrar" />
      <LoginForm onSubmit={onSubmit}>
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
          autoComplete="current-password"
          required
          error={erro}
        />

        <LoginButton type="submit" disabled={isLoading}>
          {isLoading ? "Entrando…" : "Entrar"}
        </LoginButton>
      </LoginForm>

      <SignUpLink to="/sign-up" $quiet>
        Criar conta
      </SignUpLink>
    </Page>
  );
};

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const LoginButton = styled(Button)`
  align-self: center;
  margin-top: var(--space-xs);
`;

const SignUpLink = styled(ButtonLink)`
  align-self: center;
`;

export default LoginContainer;
