import React from "react";
import styled from "styled-components";
import {
  FieldLabel,
  FieldTextArea,
  FieldWrapper
} from "../../../components/FormInput.component";
import { PersonagemProps } from "../enigma-sol-oculto-personagem.component";

const PersonagemNotasComponent: React.FC<PersonagemProps> = ({
  personagem,
  setPersonagem
}) => {
  return (
    <PersonagemNotas>
      <FieldLabel htmlFor="campo-notas">Notas</FieldLabel>
      <FieldTextArea
        id="campo-notas"
        value={personagem.notas}
        onChange={e => setPersonagem({ ...personagem, notas: e.target.value })}
      />
    </PersonagemNotas>
  );
};

const PersonagemNotas = styled(FieldWrapper)`
  grid-area: notas;
`;

export default PersonagemNotasComponent;
