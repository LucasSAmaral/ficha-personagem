import React from "react";
import styled from "styled-components";
import { PersonagemProps } from "../enigma-sol-oculto-personagem.component";

const PersonagemNotasComponent: React.FC<PersonagemProps> = ({
  personagem,
  setPersonagem
}) => {
  return (
    <PersonagemNotas>
      <PersonagemNotasTitle>Notas:</PersonagemNotasTitle>
      <PersonagemNotasValueWrapper>
        <PersonagemNotasTextArea
          value={personagem.notas}
          onChange={e =>
            setPersonagem({ ...personagem, notas: e.target.value })
          }
        />
      </PersonagemNotasValueWrapper>
    </PersonagemNotas>
  );
};

const PersonagemNotas = styled.div`
  grid-area: notas;
`;

const PersonagemNotasTitle = styled.p`
  font-size: 20px;
`;

const PersonagemNotasValueWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  font-size: 20px;
  margin-top: 20px;
`;

const PersonagemNotasTextArea = styled.textarea`
  padding: 10px;
`;

export default PersonagemNotasComponent;
