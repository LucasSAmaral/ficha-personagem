import React from "react";
import styled from "styled-components";
import { PersonagemProps } from "../enigma-sol-oculto-personagem.component";

const PersonagemSanidadeComponent: React.FC<PersonagemProps> = ({
  personagem,
  setPersonagem
}) => {
  return (
    <PersonagemSanidade>
      <PersonagemSanidadeTitle>Sanidade Atual:</PersonagemSanidadeTitle>
      <PersonagemSanidadeValueWrapper>
        <PersonagemSanidadeButton
          onClick={() =>
            setPersonagem({ ...personagem, sanidade: personagem.sanidade - 1 })
          }
        >
          -
        </PersonagemSanidadeButton>
        <span>{personagem.sanidade}</span>
        <PersonagemSanidadeButton
          onClick={() =>
            setPersonagem({ ...personagem, sanidade: personagem.sanidade + 1 })
          }
        >
          +
        </PersonagemSanidadeButton>
      </PersonagemSanidadeValueWrapper>
    </PersonagemSanidade>
  );
};

const PersonagemSanidade = styled.div`
  grid-area: sanidade;
`;

const PersonagemSanidadeTitle = styled.p`
  font-size: 20px;
`;

const PersonagemSanidadeValueWrapper = styled.div`
  display: flex;
  width: 100%;
  font-size: 35px;
  margin-top: 20px;

  span {
    margin: 0 30px;
    width: 35px;
  }
`;

const PersonagemSanidadeButton = styled.button`
  width: 100%;
  cursor: pointer;
`;

export default PersonagemSanidadeComponent;
