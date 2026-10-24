import React from "react";
import styled from "styled-components";
import {
  FieldInput,
  FieldLabel,
  FieldWrapper
} from "../../../components/FormInput.component";
import { PersonagemProps } from "../enigma-sol-oculto-personagem.component";

const PersonagemUltimoParagrafoComponent: React.FC<PersonagemProps> = ({
  personagem,
  setPersonagem
}) => {
  return (
    <PersonagemUltimoParagrafo>
      <FieldLabel htmlFor="campo-ultimo-paragrafo">Último parágrafo</FieldLabel>
      <FieldInput
        id="campo-ultimo-paragrafo"
        type="text"
        inputMode="numeric"
        value={personagem.ultimoParagrafo}
        onChange={e =>
          setPersonagem({ ...personagem, ultimoParagrafo: e.target.value })
        }
      />
    </PersonagemUltimoParagrafo>
  );
};

const PersonagemUltimoParagrafo = styled(FieldWrapper)`
  grid-area: ultParagrafo;
`;

export default PersonagemUltimoParagrafoComponent;
