import { css } from "styled-components";

export const ButtonCssStyle = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  width: 100%;
  max-width: 300px;
  min-height: 52px;
  padding: var(--space-sm) var(--space-md);
  font-family: var(--fp-button-font);
  font-weight: var(--fp-button-weight);
  font-size: 15px;
  line-height: 20px;
  letter-spacing: var(--fp-button-track);
  text-transform: uppercase;
  text-align: center;
  text-decoration: none;
  color: var(--on-accent);
  background: var(--accent);
  border: 1px solid var(--accent);
  border-radius: var(--fp-radius);
  cursor: pointer;
  transition: filter 0.2s ease, transform 0.2s ease;

  [data-theme="lobisomem"] & {
    text-transform: none;
    font-size: 16px;
    box-shadow: inset 0 0 0 3px var(--accent), inset 0 0 0 4px var(--on-accent);
  }

  &:hover {
    filter: brightness(1.15);
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 3px solid var(--focus);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    filter: none;
    transform: none;
  }
`;

export const QuietButtonCssStyle = css`
  ${ButtonCssStyle}
  color: var(--accent-ink);
  background: transparent;
  border-color: var(--line);

  [data-theme="lobisomem"] & {
    box-shadow: none;
  }

  &:hover {
    filter: none;
    background: var(--surface-raised);
  }
`;
