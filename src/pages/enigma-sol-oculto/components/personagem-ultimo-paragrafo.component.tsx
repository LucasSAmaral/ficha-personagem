import React from "react";
import styled from "styled-components";
import { PersonagemProps } from "../enigma-sol-oculto-personagem.component";

const PersonagemUltimoParagrafoComponent: React.FC<PersonagemProps> = ({
  personagem,
  setPersonagem
}) => {
  return (
    <PersonagemUltimoParagrafo>
      <PersonagemUltimoParagrafoTitle>
        Último Parágrafo:
      </PersonagemUltimoParagrafoTitle>
      <PersonagemUltimoParagrafoValueWrapper>
        <PersonagemUltimoParagrafoInput
          type="text"
          value={personagem.ultimoParagrafo}
          onChange={e =>
            setPersonagem({ ...personagem, ultimoParagrafo: e.target.value })
          }
        />
      </PersonagemUltimoParagrafoValueWrapper>
    </PersonagemUltimoParagrafo>
  );
};

const PersonagemUltimoParagrafo = styled.div`
  grid-area: ultParagrafo;
`;

const PersonagemUltimoParagrafoTitle = styled.p`
  font-size: 20px;
`;

const PersonagemUltimoParagrafoValueWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  font-size: 20px;
  margin-top: 20px;
`;

const PersonagemUltimoParagrafoInput = styled.input`
  padding: 10px;
`;

export default PersonagemUltimoParagrafoComponent;
