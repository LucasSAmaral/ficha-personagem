import React, { useState } from "react";
import styled from "styled-components";
import { PersonagemProps } from "../enigma-sol-oculto-personagem.component";

const PersonagemTracosComponent: React.FC<PersonagemProps> = ({
  personagem,
  setPersonagem
}) => {
  const [traco, setTraco] = useState("");
  return (
    <PersonagemTracos>
      <PersonagemTracosTitle>Traços:</PersonagemTracosTitle>
      <PersonagemTracosValueWrapper>
        {personagem.tracos.map((traco, index) => (
          <PersonagemTracosValueOptionWrapper key={index}>
            <PersonagemTracosValue>{traco}</PersonagemTracosValue>
            <PersonagemTracosRemoveOption
              onClick={() =>
                setPersonagem({
                  ...personagem,
                  tracos: personagem.tracos.filter(t => t !== traco)
                })
              }
            >
              Remover Traço
            </PersonagemTracosRemoveOption>
          </PersonagemTracosValueOptionWrapper>
        ))}
        <PersonagemTracosInput
          type="text"
          value={traco}
          required
          onChange={e => setTraco(e.target.value)}
        />
        <AddPersonagemTracosButton
          onClick={() => {
            Boolean(traco)
              ? setPersonagem({
                  ...personagem,
                  tracos: [...personagem.tracos, traco]
                })
              : alert("Traço não pode ser em branco");
            setTraco("");
          }}
        >
          Adicionar Traço
        </AddPersonagemTracosButton>
      </PersonagemTracosValueWrapper>
    </PersonagemTracos>
  );
};

const PersonagemTracos = styled.div`
  grid-area: tracos;
`;

const PersonagemTracosTitle = styled.p`
  font-size: 20px;
`;

const PersonagemTracosValueWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  font-size: 20px;
  margin-top: 20px;
`;

const PersonagemTracosValue = styled.div`
  width: 100%;
  text-align: left;
`;

const PersonagemTracosValueOptionWrapper = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const PersonagemTracosRemoveOption = styled.button`
  width: 100%;
  cursor: pointer;
`;

const PersonagemTracosInput = styled.input`
  padding: 10px;
`;

const AddPersonagemTracosButton = styled.button`
  width: 100%;
  margin-top: 10px;
  cursor: pointer;
`;

export default PersonagemTracosComponent;
