import React, { useRef, useState } from "react";
import styled from "styled-components";
import { FocusCssStyle, LabelCssStyle } from "../theme/tokens";
import Button from "./Button.component";
import { FieldInput, FieldWrapper } from "./FormInput.component";

type ListFieldComponentProps = {
  id: string;
  title: string;
  itemLabel: string;
  items: Array<string>;
  onChange: (items: Array<string>) => void;
  area?: string;
};

const ListFieldComponent: React.FC<ListFieldComponentProps> = ({
  id,
  title,
  itemLabel,
  items,
  onChange,
  area
}) => {
  const [novoItem, setNovoItem] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = `lista-${id}`;
  const inputId = `lista-${id}-novo`;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const valor = novoItem.trim();
    if (valor) {
      onChange([...items, valor]);
      setNovoItem("");
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <ListField $area={area} aria-labelledby={titleId}>
      <ListFieldTitle id={titleId}>{title}</ListFieldTitle>
      {items.length > 0 ? (
        <ListFieldItems>
          {items.map((item, index) => (
            <ListFieldItem key={`${item}-${index}`}>
              <ListFieldText>{item}</ListFieldText>
              <ListFieldRemove
                type="button"
                aria-label={`Remover ${itemLabel} ${item}`}
                onClick={() => onChange(items.filter((_, i) => i !== index))}
              >
                Remover
              </ListFieldRemove>
            </ListFieldItem>
          ))}
        </ListFieldItems>
      ) : (
        <ListFieldEmpty>Nenhum {itemLabel} ainda.</ListFieldEmpty>
      )}
      <ListFieldForm onSubmit={onSubmit}>
        <FieldWrapper>
          <VisuallyHidden as="label" htmlFor={inputId}>
            Novo {itemLabel}
          </VisuallyHidden>
          <FieldInput
            ref={inputRef}
            id={inputId}
            type="text"
            value={novoItem}
            placeholder={`Novo ${itemLabel}`}
            onChange={e => setNovoItem(e.target.value)}
          />
        </FieldWrapper>
        <Button type="submit" $quiet $inline>
          Adicionar
        </Button>
      </ListFieldForm>
    </ListField>
  );
};

const ListField = styled.section<{ $area?: string }>`
  grid-area: ${({ $area }) => $area || "auto"};
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  min-width: 0;
`;

const ListFieldTitle = styled.h2`
  ${LabelCssStyle}
`;

const ListFieldItems = styled.ul`
  list-style: none;
`;

const ListFieldItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xs);
  min-height: var(--control-min);
  border-bottom: 1px solid var(--hairline);
`;

const ListFieldText = styled.span`
  min-width: 0;
  overflow-wrap: anywhere;
`;

const ListFieldRemove = styled.button`
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

const ListFieldEmpty = styled.p`
  font-style: italic;
  color: var(--ink-muted);
`;

const ListFieldForm = styled.form`
  display: flex;
  align-items: flex-end;
  gap: var(--space-xs);

  ${FieldWrapper} {
    flex: 1;
  }
`;

export const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`;

export default ListFieldComponent;
