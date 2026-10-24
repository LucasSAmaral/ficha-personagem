import React, { useRef, useState } from "react";
import styled from "styled-components";
import Button from "../../../components/Button.component";
import {
  FieldInput,
  FieldWrapper
} from "../../../components/FormInput.component";
import { FocusCssStyle, LabelCssStyle } from "../../../theme/tokens";
import { PersonagemProps } from "../enigma-sol-oculto-personagem.component";

type ArrayProp = "tracos" | "equipamento";

type PersonagemArrayProps = PersonagemProps & {
  title: string;
  prop: ArrayProp;
};

const PropMap = {
  tracos: "traço",
  equipamento: "item"
};

const PersonagemArrayPropComponent: React.FC<PersonagemArrayProps> = ({
  title,
  prop,
  personagem,
  setPersonagem
}) => {
  const [arrayProp, setArrayProp] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = `lista-${prop}`;
  const inputId = `lista-${prop}-novo`;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const novoValor = arrayProp.trim();
    if (novoValor) {
      setPersonagem({
        ...personagem,
        [prop]: [...personagem[prop], novoValor]
      });
      setArrayProp("");
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <PersonagemArray prop={prop} aria-labelledby={titleId}>
      <PersonagemArrayTitle id={titleId}>{title}</PersonagemArrayTitle>
      {personagem[prop].length > 0 ? (
        <PersonagemArrayList>
          {personagem[prop].map((propValue, index) => (
            <PersonagemArrayItem key={`${propValue}-${index}`}>
              <PersonagemArrayValue>{propValue}</PersonagemArrayValue>
              <PersonagemArrayRemoveOption
                type="button"
                aria-label={`Remover ${PropMap[prop]} ${propValue}`}
                onClick={() =>
                  setPersonagem({
                    ...personagem,
                    [prop]: personagem[prop].filter((_, i) => i !== index)
                  })
                }
              >
                Remover
              </PersonagemArrayRemoveOption>
            </PersonagemArrayItem>
          ))}
        </PersonagemArrayList>
      ) : (
        <PersonagemArrayEmpty>Nenhum {PropMap[prop]} ainda.</PersonagemArrayEmpty>
      )}
      <PersonagemArrayForm onSubmit={onSubmit}>
        <FieldWrapper>
          <VisuallyHidden as="label" htmlFor={inputId}>
            Novo {PropMap[prop]}
          </VisuallyHidden>
          <FieldInput
            ref={inputRef}
            id={inputId}
            type="text"
            value={arrayProp}
            placeholder={`Novo ${PropMap[prop]}`}
            onChange={e => setArrayProp(e.target.value)}
          />
        </FieldWrapper>
        <Button type="submit" $quiet $inline>
          Adicionar
        </Button>
      </PersonagemArrayForm>
    </PersonagemArray>
  );
};

const PersonagemArray = styled.section<{ prop: ArrayProp }>`
  grid-area: ${({ prop }) => prop};
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  min-width: 0;
`;

const PersonagemArrayTitle = styled.h2`
  ${LabelCssStyle}
`;

const PersonagemArrayList = styled.ul`
  list-style: none;
`;

const PersonagemArrayItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xs);
  min-height: var(--control-min);
  border-bottom: 1px solid var(--hairline);
`;

const PersonagemArrayValue = styled.span`
  min-width: 0;
  overflow-wrap: anywhere;
`;

const PersonagemArrayRemoveOption = styled.button`
  ${LabelCssStyle}
  ${FocusCssStyle}
  flex: none;
  min-height: var(--control-min);
  padding: 0 var(--space-2xs);
  background: none;
  border: 0;
  cursor: pointer;

  &:hover {
    color: var(--danger);
    text-decoration: underline;
  }
`;

const PersonagemArrayEmpty = styled.p`
  font-style: italic;
  color: var(--ink-muted);
`;

const PersonagemArrayForm = styled.form`
  display: flex;
  align-items: flex-end;
  gap: var(--space-xs);

  ${FieldWrapper} {
    flex: 1;
  }
`;

const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`;

export default PersonagemArrayPropComponent;
