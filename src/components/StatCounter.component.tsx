import React from "react";
import styled from "styled-components";
import { FocusCssStyle, LabelCssStyle } from "../theme/tokens";

export type StatKind = "plain" | "vital" | "mind" | "coin" | "change";

const StatColorMap: { [kind in StatKind]: string } = {
  plain: "var(--ink)",
  vital: "var(--stat-vital)",
  mind: "var(--stat-mind)",
  coin: "var(--stat-coin)",
  change: "var(--accent-ink)"
};

type StatCounterComponentProps = {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  kind?: StatKind;
  initial?: number;
  critical?: boolean;
  min?: number;
  area?: string;
};

const StatCounterComponent: React.FC<StatCounterComponentProps> = ({
  id,
  label,
  value,
  onChange,
  kind = "plain",
  initial,
  critical = false,
  min,
  area
}) => {
  const labelId = `atributo-${id}`;
  const atMin = min !== undefined && value <= min;

  return (
    <StatCounter $area={area}>
      <StatCounterHead>
        <StatCounterLabel id={labelId}>{label}</StatCounterLabel>
        {critical && <StatCounterFlag>Crítico</StatCounterFlag>}
      </StatCounterHead>
      <StatCounterRow>
        <StatCounterButton
          type="button"
          aria-label={`Diminuir ${label}`}
          disabled={atMin}
          onClick={() => onChange(value - 1)}
        >
          −
        </StatCounterButton>
        <StatCounterValue
          aria-labelledby={labelId}
          aria-live="polite"
          $color={critical ? "var(--danger)" : StatColorMap[kind]}
        >
          {value}
        </StatCounterValue>
        <StatCounterButton
          type="button"
          aria-label={`Aumentar ${label}`}
          onClick={() => onChange(value + 1)}
        >
          +
        </StatCounterButton>
      </StatCounterRow>
      {initial !== undefined && (
        <StatCounterInitial>Inicial {initial}</StatCounterInitial>
      )}
    </StatCounter>
  );
};

const StatCounter = styled.div<{ $area?: string }>`
  grid-area: ${({ $area }) => $area || "auto"};
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  min-width: 0;
`;

const StatCounterHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-xs);
`;

const StatCounterLabel = styled.span`
  ${LabelCssStyle}
`;

const StatCounterFlag = styled.span`
  ${LabelCssStyle}
  font-size: 13px;
  line-height: 16px;
  text-transform: uppercase;
  color: var(--danger);
`;

const StatCounterRow = styled.div`
  display: grid;
  grid-template-columns: var(--control-min) 1fr var(--control-min);
  align-items: center;
  gap: var(--space-xs);
`;

const StatCounterValue = styled.output<{ $color: string }>`
  font-family: var(--fp-stat-font);
  font-weight: var(--fp-stat-weight);
  font-size: 36px;
  line-height: 40px;
  font-variant-numeric: tabular-nums lining-nums;
  text-align: center;
  color: ${({ $color }) => $color};
`;

const StatCounterButton = styled.button`
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

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const StatCounterInitial = styled.span`
  ${LabelCssStyle}
  font-size: 13px;
  line-height: 16px;
  font-variant-numeric: tabular-nums;
`;

export default StatCounterComponent;
