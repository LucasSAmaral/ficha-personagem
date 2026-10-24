import React from "react";
import styled from "styled-components";
import { FocusCssStyle, LabelCssStyle } from "../../../theme/tokens";
import { PersonagemProps } from "../enigma-sol-oculto-personagem.component";

type NumberProp = "saude" | "sanidade" | "dinheiro";

type PersonagemNumberProps = PersonagemProps & {
  title: string;
  prop: NumberProp;
};

const StatColorMap = {
  saude: "var(--stat-vital)",
  sanidade: "var(--stat-mind)",
  dinheiro: "var(--stat-coin)"
};

const LIMITE_CRITICO = 3;

const PersonagemNumberPropComponent: React.FC<PersonagemNumberProps> = ({
  title,
  prop,
  personagem,
  setPersonagem
}) => {
  const valor = personagem[prop];
  const critico = prop !== "dinheiro" && valor <= LIMITE_CRITICO;
  const labelId = `atributo-${prop}`;

  return (
    <PersonagemProp prop={prop}>
      <PersonagemPropHead>
        <PersonagemPropTitle id={labelId}>{title}</PersonagemPropTitle>
        {critico && <PersonagemPropFlag>Crítico</PersonagemPropFlag>}
      </PersonagemPropHead>
      <PersonagemPropValueWrapper>
        <PersonagemPropButton
          type="button"
          aria-label={`Diminuir ${title}`}
          onClick={() => setPersonagem({ ...personagem, [prop]: valor - 1 })}
        >
          −
        </PersonagemPropButton>
        <PersonagemPropValue
          aria-labelledby={labelId}
          aria-live="polite"
          $color={critico ? "var(--danger)" : StatColorMap[prop]}
        >
          {valor}
        </PersonagemPropValue>
        <PersonagemPropButton
          type="button"
          aria-label={`Aumentar ${title}`}
          onClick={() => setPersonagem({ ...personagem, [prop]: valor + 1 })}
        >
          +
        </PersonagemPropButton>
      </PersonagemPropValueWrapper>
    </PersonagemProp>
  );
};

const PersonagemProp = styled.div<{ prop: NumberProp }>`
  grid-area: ${({ prop }) => prop};
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  min-width: 0;
`;

const PersonagemPropHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-xs);
`;

const PersonagemPropTitle = styled.span`
  ${LabelCssStyle}
`;

const PersonagemPropFlag = styled.span`
  ${LabelCssStyle}
  font-size: 13px;
  line-height: 16px;
  text-transform: uppercase;
  color: var(--danger);
`;

const PersonagemPropValueWrapper = styled.div`
  display: grid;
  grid-template-columns: var(--control-min) 1fr var(--control-min);
  align-items: center;
  gap: var(--space-xs);
`;

const PersonagemPropValue = styled.output<{ $color: string }>`
  font-family: var(--fp-stat-font);
  font-weight: var(--fp-stat-weight);
  font-size: 36px;
  line-height: 40px;
  font-variant-numeric: tabular-nums lining-nums;
  text-align: center;
  color: ${({ $color }) => $color};
`;

const PersonagemPropButton = styled.button`
  ${FocusCssStyle}
  width: var(--control-min);
  height: var(--control-min);
  font-family: var(--fp-stat-font);
  font-size: 24px;
  line-height: 1;
  color: var(--ink);
  background: var(--surface-raised);
  border: 1px solid var(--line);
  border-radius: var(--fp-radius);
  cursor: pointer;

  &:hover {
    border-color: var(--ink);
  }
`;

export default PersonagemNumberPropComponent;
