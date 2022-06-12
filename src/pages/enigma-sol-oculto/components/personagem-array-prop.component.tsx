import React, { useState } from "react";
import styled from "styled-components";
import { PersonagemProps } from "../enigma-sol-oculto-personagem.component";

type ArrayProp = "tracos" | "equipamento";

type PersonagemArrayProps = PersonagemProps & {
  title: string;
  prop: ArrayProp;
};

const PropMap = {
  tracos: "Traço",
  equipamento: "Equipamento"
};

const PersonagemArrayPropComponent: React.FC<PersonagemArrayProps> = ({
  title,
  prop,
  personagem,
  setPersonagem
}) => {
  const [arrayProp, setArrayProp] = useState("");
  return (
    <PersonagemArray prop={prop}>
      <PersonagemArrayTitle>{title}</PersonagemArrayTitle>
      <PersonagemArrayValueWrapper>
        {personagem[prop].map((propValue, index) => (
          <PersonagemArrayValueOptionWrapper key={index}>
            <PersonagemArrayValue>{propValue}</PersonagemArrayValue>
            <PersonagemArrayRemoveOption
              onClick={() =>
                setPersonagem({
                  ...personagem,
                  [prop]: personagem[prop].filter(t => t !== propValue)
                })
              }
            >
              Remover {PropMap[prop]}
            </PersonagemArrayRemoveOption>
          </PersonagemArrayValueOptionWrapper>
        ))}
        <PersonagemArrayInput
          type="text"
          value={arrayProp}
          required
          onChange={e => setArrayProp(e.target.value)}
        />
        <AddPersonagemArrayButton
          onClick={() => {
            Boolean(arrayProp)
              ? setPersonagem({
                  ...personagem,
                  [prop]: [...personagem[prop], arrayProp]
                })
              : alert(`${PropMap[prop]} não pode ser em branco`);
            setArrayProp("");
          }}
        >
          Adicionar {PropMap[prop]}
        </AddPersonagemArrayButton>
      </PersonagemArrayValueWrapper>
    </PersonagemArray>
  );
};

const PersonagemArray = styled.div<{ prop: ArrayProp }>`
  grid-area: ${({ prop }) => prop};
`;

const PersonagemArrayTitle = styled.p`
  font-size: 20px;
`;

const PersonagemArrayValueWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  font-size: 20px;
  margin-top: 20px;
`;

const PersonagemArrayValue = styled.div`
  width: 100%;
  text-align: left;
`;

const PersonagemArrayValueOptionWrapper = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const PersonagemArrayRemoveOption = styled.button`
  width: 100%;
  cursor: pointer;
`;

const PersonagemArrayInput = styled.input`
  padding: 10px;
`;

const AddPersonagemArrayButton = styled.button`
  width: 100%;
  margin-top: 10px;
  cursor: pointer;
  padding: 10px 0;
`;

export default PersonagemArrayPropComponent;
