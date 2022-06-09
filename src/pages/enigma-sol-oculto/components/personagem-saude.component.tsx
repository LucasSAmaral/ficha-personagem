import React from "react";
import styled from "styled-components";
import { PersonagemProps } from "../enigma-sol-oculto-personagem.component";

const PersonagemSaudeComponent: React.FC<PersonagemProps> = ({
  personagem,
  setPersonagem
}) => {
  return (
    <PersonagemSaude>
      <PersonagemSaudeTitle>Saúde Atual:</PersonagemSaudeTitle>
      <PersonagemSaudeValueWrapper>
        <PersonagemSaudeButton
          onClick={() =>
            setPersonagem({ ...personagem, saude: personagem.saude - 1 })
          }
        >
          -
        </PersonagemSaudeButton>
        <span>{personagem.saude}</span>
        <PersonagemSaudeButton
          onClick={() =>
            setPersonagem({ ...personagem, saude: personagem.saude + 1 })
          }
        >
          +
        </PersonagemSaudeButton>
      </PersonagemSaudeValueWrapper>
    </PersonagemSaude>
  );
};

const PersonagemSaude = styled.div`
  grid-area: saude;
`;

const PersonagemSaudeTitle = styled.p`
  font-size: 20px;
`;

const PersonagemSaudeValueWrapper = styled.div`
  display: flex;
  width: 100%;
  font-size: 35px;
  margin-top: 20px;

  span {
    margin: 0 30px;
    width: 35px;
  }
`;

const PersonagemSaudeButton = styled.button`
  width: 100%;
  cursor: pointer;
`;

export default PersonagemSaudeComponent;
