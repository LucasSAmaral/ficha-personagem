import { useAuthSignOut, useAuthUser } from "@react-query-firebase/auth";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../../firebase/firebase.utils";

const MainPageContainer: React.FC = () => {
  const mutation = useAuthSignOut(auth);
  const { isLoading } = useAuthUser(["user"], auth);

  if (isLoading) {
    return (
      <MainPageWrapper>
        <MainPageTitle>Ficha Personagem</MainPageTitle>
        Loading...
      </MainPageWrapper>
    );
  }

  if (!auth.currentUser) {
    return (
      <MainPageWrapper>
        <MainPageTitle>Ficha Personagem</MainPageTitle>
        <MainPageLink to="/login">Login</MainPageLink>
      </MainPageWrapper>
    );
  }
  return (
    <MainPageWrapper>
      <MainPageTitle>Ficha Personagem</MainPageTitle>
      <MainPageLink to="/enigma-sol-oculto/personagem">
        O Enigma do Sol Oculto
      </MainPageLink>
      <button onClick={() => mutation.mutate()}>deslogar</button>
    </MainPageWrapper>
  );
};

export const MainPageWrapper = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  height: 100vh;
  padding-top: 50px;

  display: grid;
  grid-template-areas:
    "title"
    "login";
  grid-template-rows: repeat(2, 125px);
  align-items: center;
  text-align: center;
`;

const MainPageTitle = styled.h2`
  font-size: ${(props) => props.theme.titleFontSize};
  grid-area: title;
`;

const MainPageLink = styled(Link)`
  grid-area: login;
  text-decoration: none;
  background-color: #310303;
  color: white;
  font-weight: bold;
  text-align: center;
  padding: 20px 0px;
  margin: 0 auto;
  text-transform: uppercase;
  width: 300px;
  align-self: center;
`;

export default MainPageContainer;
