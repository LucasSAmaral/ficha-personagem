import { useAuthSignOut, useAuthUser } from "@react-query-firebase/auth";
import React from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { auth } from "../../firebase/firebase.utils";
import { ButtonCssStyle } from "../../theme/styles";

type GridArea = "login" | "enigma-sol-oculto" | "uivo-do-lobisomem";

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
      <LogoutButton onClick={() => mutation.mutate()}>deslogar</LogoutButton>
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
            "enigma-sol-oculto";
        `
      : css`
          grid-template-areas:
            "title"
            "login";
        `}
  align-items: center;
  text-align: center;
  grid-template-rows: repeat(2, 57px);
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
  gridArea: GridArea;
}>`
  grid-area: ${({ gridArea }) => gridArea};
  ${ButtonCssStyle}
`;

const LogoutButton = styled.button`
  ${ButtonCssStyle}
  border: none;
  cursor: pointer;
`;

export default MainPageContainer;
