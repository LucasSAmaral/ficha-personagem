import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { MainPageWrapper } from "../main/Main.container";

const LoginContainer: React.FC = () => {
  return (
    <LoginWrapper>
      <LoginTitle>Login</LoginTitle>
      <LoginForm></LoginForm>

      <SignUpLink to="/sign-up">Cadastre-se</SignUpLink>
    </LoginWrapper>
  );
};

const LoginWrapper = styled(MainPageWrapper)`
  grid-template-areas:
    "title"
    "form"
    "signUpButton";
`;

const LoginTitle = styled.h2`
  font-size: ${(props) => props.theme.titleFontSize};
  grid-area: title;
`;

const LoginForm = styled.form`
  grid-area: form;
`;

const SignUpLink = styled(Link)`
  grid-area: signUpButton;
  text-decoration: none;
  background-color: #310303;
  color: white;
  font-weight: bold;
  text-align: center;
  padding: 20px 0px;
  margin: 0 auto;
  text-transform: uppercase;
  width: 150px;
  align-self: center;
`;

export default LoginContainer;
