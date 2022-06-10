import React, { useState } from "react";
import styled from "styled-components";
import { PersonagemProps } from "../enigma-sol-oculto-personagem.component";

const PersonagemEquipamentosComponent: React.FC<PersonagemProps> = ({
  personagem,
  setPersonagem
}) => {
  const [equipamento, setEquipamento] = useState("");
  return (
    <PersonagemEquipamentos>
      <PersonagemEquipamentosTitle>Equipamentos:</PersonagemEquipamentosTitle>
      <PersonagemEquipamentosValueWrapper>
        {personagem.equipamento.map((equipamento, index) => (
          <PersonagemEquipamentosValueOptionWrapper key={index}>
            <PersonagemEquipamentosValue>
              {equipamento}
            </PersonagemEquipamentosValue>
            <PersonagemEquipamentosRemoveOption
              onClick={() =>
                setPersonagem({
                  ...personagem,
                  equipamento: personagem.equipamento.filter(
                    e => e !== equipamento
                  )
                })
              }
            >
              Remover Equipamento
            </PersonagemEquipamentosRemoveOption>
          </PersonagemEquipamentosValueOptionWrapper>
        ))}
        <PersonagemEquipamentosInput
          type="text"
          value={equipamento}
          required
          onChange={e => setEquipamento(e.target.value)}
        />
        <AddPersonagemEquipamentosButton
          onClick={() => {
            Boolean(equipamento)
              ? setPersonagem({
                  ...personagem,
                  equipamento: [...personagem.equipamento, equipamento]
                })
              : alert("Equipamento não pode ser em branco");
            setEquipamento("");
          }}
        >
          Adicionar Equipamento
        </AddPersonagemEquipamentosButton>
      </PersonagemEquipamentosValueWrapper>
    </PersonagemEquipamentos>
  );
};

const PersonagemEquipamentos = styled.div`
  grid-area: equipamentos;
`;

const PersonagemEquipamentosTitle = styled.p`
  font-size: 20px;
`;

const PersonagemEquipamentosValueWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  font-size: 20px;
  margin-top: 20px;
`;

const PersonagemEquipamentosValue = styled.div`
  width: 100%;
  text-align: left;
`;

const PersonagemEquipamentosValueOptionWrapper = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const PersonagemEquipamentosRemoveOption = styled.button`
  width: 100%;
  cursor: pointer;
`;

const PersonagemEquipamentosInput = styled.input`
  padding: 10px;
`;

const AddPersonagemEquipamentosButton = styled.button`
  width: 100%;
  margin-top: 10px;
  cursor: pointer;
  padding: 10px 0;
`;

export default PersonagemEquipamentosComponent;
