import React from "react";
import styled from "styled-components";
import { LabelCssStyle } from "../../../theme/tokens";
import { PersonagemProps } from "../enigma-sol-oculto-personagem.component";

const PersonagemStatusComponent: React.FC<PersonagemProps> = ({
  personagem,
  setPersonagem
}) => {
  return (
    <PersonagemStatus>
      <PersonagemStatusTitle id="status-titulo">Status</PersonagemStatusTitle>
      <PersonagemStatusToggleContainer
        type="button"
        role="switch"
        aria-checked={personagem.morto}
        aria-labelledby="status-titulo"
        status={personagem.morto}
        onClick={() => setPersonagem({ ...personagem, morto: !personagem.morto })}
      >
        <PersonagemStatusTrack>
          <PersonagemStatusToggle />
        </PersonagemStatusTrack>
        <PersonagemStatusValue>
          {personagem.morto ? "Morto" : "Vivo"}
        </PersonagemStatusValue>
      </PersonagemStatusToggleContainer>
    </PersonagemStatus>
  );
};

const PersonagemStatus = styled.div`
  grid-area: status;
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
`;

const PersonagemStatusTitle = styled.span`
  ${LabelCssStyle}
`;

const PersonagemStatusValue = styled.span`
  ${LabelCssStyle}
  font-size: 15px;
  color: inherit;
`;

const PersonagemStatusTrack = styled.span`
  position: relative;
  width: 64px;
  height: 32px;
  background: var(--surface-sunken);
  border: 1px solid var(--line);
  border-radius: var(--radius-pill);
  transition: background-color 0.4s ease;
`;

const PersonagemStatusToggle = styled.span`
  position: absolute;
  top: 3px;
  left: 3px;
  width: 24px;
  height: 24px;
  background: var(--ink-muted);
  border-radius: var(--radius-pill);
  transition: left 0.4s ease, background-color 0.4s ease;
`;

const PersonagemStatusToggleContainer = styled.button<{ status: boolean }>`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-height: var(--control-min);
  font: inherit;
  color: ${({ status }) => (status ? "var(--danger)" : "var(--ink)")};
  background: none;
  border: 0;
  cursor: pointer;

  &:focus-visible {
    outline: 3px solid var(--focus);
    outline-offset: 4px;
  }

  ${PersonagemStatusTrack} {
    background: ${({ status }) =>
      status ? "var(--danger)" : "var(--surface-sunken)"};
    border-color: ${({ status }) => (status ? "var(--danger)" : "var(--line)")};
  }

  ${PersonagemStatusToggle} {
    left: ${({ status }) => (status ? "35px" : "3px")};
    background: ${({ status }) =>
      status ? "var(--surface)" : "var(--ink-muted)"};
  }
`;

export default PersonagemStatusComponent;
