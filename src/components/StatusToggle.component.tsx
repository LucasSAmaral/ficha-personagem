import React from "react";
import styled from "styled-components";
import { LabelCssStyle } from "../theme/tokens";

type StatusToggleComponentProps = {
  morto: boolean;
  onChange: (morto: boolean) => void;
  area?: string;
};

const StatusToggleComponent: React.FC<StatusToggleComponentProps> = ({
  morto,
  onChange,
  area
}) => {
  return (
    <StatusToggle $area={area}>
      <StatusToggleTitle id="status-titulo">Status</StatusToggleTitle>
      <StatusToggleButton
        type="button"
        role="switch"
        aria-checked={morto}
        aria-labelledby="status-titulo"
        $on={morto}
        onClick={() => onChange(!morto)}
      >
        <StatusToggleTrack>
          <StatusToggleThumb />
        </StatusToggleTrack>
        <StatusToggleText>{morto ? "Morto" : "Vivo"}</StatusToggleText>
      </StatusToggleButton>
    </StatusToggle>
  );
};

const StatusToggle = styled.div<{ $area?: string }>`
  grid-area: ${({ $area }) => $area || "auto"};
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
`;

const StatusToggleTitle = styled.span`
  ${LabelCssStyle}
`;

const StatusToggleText = styled.span`
  ${LabelCssStyle}
  font-size: 15px;
  color: inherit;
`;

const StatusToggleTrack = styled.span`
  position: relative;
  width: 64px;
  height: 32px;
  border: 1px solid var(--line);
  border-radius: var(--radius-pill);
  transition: background-color 0.4s ease;
`;

const StatusToggleThumb = styled.span`
  position: absolute;
  top: 3px;
  left: 3px;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-pill);
  transition: left 0.4s ease, background-color 0.4s ease;
`;

const StatusToggleButton = styled.button<{ $on: boolean }>`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-height: var(--control-min);
  font: inherit;
  color: ${({ $on }) => ($on ? "var(--danger)" : "var(--ink)")};
  background: none;
  border: 0;
  cursor: pointer;

  &:focus-visible {
    outline: 3px solid var(--focus);
    outline-offset: 4px;
  }

  ${StatusToggleTrack} {
    background: ${({ $on }) =>
      $on ? "var(--danger)" : "var(--surface-sunken)"};
    border-color: ${({ $on }) => ($on ? "var(--danger)" : "var(--line)")};
  }

  ${StatusToggleThumb} {
    left: ${({ $on }) => ($on ? "35px" : "3px")};
    background: ${({ $on }) => ($on ? "var(--surface)" : "var(--ink-muted)")};
  }
`;

export default StatusToggleComponent;
