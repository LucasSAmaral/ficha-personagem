import React from "react";
import styled from "styled-components";
import { PersonagemProps } from "../enigma-sol-oculto-personagem.component";

type NumberProp = "saude" | "sanidade" | "dinheiro";

type PersonagemNumberProps = PersonagemProps & {
  title: string;
  prop: NumberProp;
};

const PersonagemNumberPropComponent: React.FC<PersonagemNumberProps> = ({
  title,
  prop,
  personagem,
  setPersonagem
}) => {
  return (
    <PersonagemProp prop={prop}>
      <PersonagemPropTitle>{title}</PersonagemPropTitle>
      <PersonagemPropValueWrapper>
        <PersonagemPropButton
          onClick={() =>
            setPersonagem({ ...personagem, [prop]: personagem[prop] - 1 })
          }
        >
          -
        </PersonagemPropButton>
        <span>{personagem[prop]}</span>
        <PersonagemPropButton
          onClick={() =>
            setPersonagem({ ...personagem, [prop]: personagem[prop] + 1 })
          }
        >
          +
        </PersonagemPropButton>
      </PersonagemPropValueWrapper>
    </PersonagemProp>
  );
};

const PersonagemProp = styled.div<{ prop: NumberProp }>`
  grid-area: ${({ prop }) => prop};

  @media (max-width: 425px) {
    margin-top: 12px;
  }
`;

const PersonagemPropTitle = styled.p`
  font-size: 20px;
`;

const PersonagemPropValueWrapper = styled.div`
  display: flex;
  width: 100%;
  font-size: 35px;
  margin-top: 20px;

  span {
    margin: 0 30px;
    width: 35px;
  }
`;

const PersonagemPropButton = styled.button`
  width: 100%;
  cursor: pointer;
`;

export default PersonagemNumberPropComponent;
