import { useAuthSignOut, useAuthUser } from "@react-query-firebase/auth";
import React from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
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
      <MainPageWrapper isUserLoggedIn={Boolean(auth.currentUser)}>
        <MainPageTitle>Ficha Personagem</MainPageTitle>
        <MainPageLink to="/login" gridArea="login">
          Login
        </MainPageLink>
      </MainPageWrapper>
    );
  }
  return (
    <MainPageWrapper isUserLoggedIn={Boolean(auth.currentUser)}>
      <MainPageTitle>Ficha Personagem</MainPageTitle>
      <MainPageLink
        to="/enigma-sol-oculto/personagem"
        gridArea="enigma-sol-oculto"
      >
        O Enigma do Sol Oculto
      </MainPageLink>
      <MainPageLink
        to="/uivo-do-lobisomem/personagem"
        gridArea="uivo-do-lobisomem"
      >
        Uivo do Lobisomem
      </MainPageLink>
      <button onClick={() => mutation.mutate()}>deslogar</button>
    </MainPageWrapper>
  );
};

export const MainPageWrapper = styled.div<{ isUserLoggedIn?: boolean }>`
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  height: 100vh;
  padding-top: 50px;

  display: grid;
  ${({ isUserLoggedIn }) =>
    isUserLoggedIn
      ? css`
          grid-template-areas:
            "title"
            "enigma-sol-oculto"
            "uivo-do-lobisomem";
        `
      : css`
          grid-template-areas:
            "title"
            "login";
        `}
  align-items: center;
  text-align: center;
  grid-template-rows: repeat(3, 57px);
  grid-gap: 30px;

  @media (max-width: 425px) {
    grid-template-rows: 125px;
  }
`;

const MainPageTitle = styled.h2`
  font-size: ${props => props.theme.titleFontSize};
  grid-area: title;
`;

const MainPageLink = styled(Link)<{
  gridArea: "login" | "enigma-sol-oculto" | "uivo-do-lobisomem";
}>`
  grid-area: ${({ gridArea }) => gridArea};
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
