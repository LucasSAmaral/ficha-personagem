import React from "react";
import styled from "styled-components";
import { PersonagemProps } from "../enigma-sol-oculto-personagem.component";

const PersonagemStatusComponent: React.FC<PersonagemProps> = ({
  personagem,
  setPersonagem
}) => {
  return (
    <PersonagemStatus>
      <PersonagemStatusTitle>Status:</PersonagemStatusTitle>
      <PersonagemStatusValueWrapper>
        <PersonagemStatusValue>Morto: </PersonagemStatusValue>
        <PersonagemStatusToggleContainer
          status={personagem.morto}
          onClick={() =>
            setPersonagem({ ...personagem, morto: !personagem.morto })
          }
        >
          <PersonagemStatusToggle />
        </PersonagemStatusToggleContainer>
      </PersonagemStatusValueWrapper>
    </PersonagemStatus>
  );
};

const PersonagemStatus = styled.div`
  grid-area: status;
`;

const PersonagemStatusTitle = styled.p`
  font-size: 20px;
`;

const PersonagemStatusValueWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  font-size: 20px;
  margin-top: 20px;
`;

const PersonagemStatusValue = styled.div`
  width: 100%;
  text-align: left;
`;

const PersonagemStatusToggle = styled.div`
  position: absolute;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  transition: all 0.4s ease 0s;
`;

const PersonagemStatusToggleContainer = styled.div<{ status: boolean }>`
  position: relative;
  background-color: ${({ status }) => (status ? "#d4f3d4" : "lightgray")};
  width: 70px;
  height: 30px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.4s ease 0s;

  ${PersonagemStatusToggle} {
    left: ${({ status }) => (status ? "calc(100% - 30px)" : "0px")};
    background-color: ${({ status }) => (status ? "#2ceb2c" : "gray")};
  }
`;

export default PersonagemStatusComponent;
