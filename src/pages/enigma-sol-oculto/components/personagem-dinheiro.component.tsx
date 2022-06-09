import React from "react";
import styled from "styled-components";
import { PersonagemProps } from "../enigma-sol-oculto-personagem.component";

const PersonagemDinheiroComponent: React.FC<PersonagemProps> = ({
  personagem,
  setPersonagem
}) => {
  return (
    <PersonagemDinheiro>
      <PersonagemDinheiroTitle>Libras:</PersonagemDinheiroTitle>
      <PersonagemDinheiroValueWrapper>
        <PersonagemDinheiroButton
          onClick={() =>
            setPersonagem({ ...personagem, dinheiro: personagem.dinheiro - 1 })
          }
        >
          -
        </PersonagemDinheiroButton>
        <span>{personagem.dinheiro}</span>
        <PersonagemDinheiroButton
          onClick={() =>
            setPersonagem({ ...personagem, dinheiro: personagem.dinheiro + 1 })
          }
        >
          +
        </PersonagemDinheiroButton>
      </PersonagemDinheiroValueWrapper>
    </PersonagemDinheiro>
  );
};

const PersonagemDinheiro = styled.div`
  grid-area: dinheiro;
`;

const PersonagemDinheiroTitle = styled.p`
  font-size: 20px;
`;

const PersonagemDinheiroValueWrapper = styled.div`
  display: flex;
  width: 100%;
  font-size: 35px;
  margin-top: 20px;

  span {
    margin: 0 30px;
    width: 35px;
  }
`;

const PersonagemDinheiroButton = styled.button`
  width: 100%;
  cursor: pointer;
`;

export default PersonagemDinheiroComponent;
