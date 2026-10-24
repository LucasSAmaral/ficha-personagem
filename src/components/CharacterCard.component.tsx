import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FocusCssStyle, LabelCssStyle, media } from "../theme/tokens";

export type CharacterCardStat = {
  label: string;
  value: number;
  color: string;
};

type CharacterCardComponentProps = {
  to: string;
  nome: string;
  stats: Array<CharacterCardStat>;
  ultimoParagrafo: string;
  morto: boolean;
};

const CharacterCardComponent: React.FC<CharacterCardComponentProps> = ({
  to,
  nome,
  stats,
  ultimoParagrafo,
  morto
}) => {
  return (
    <CharacterCard to={to}>
      <CharacterCardNome>{nome}</CharacterCardNome>
      <CharacterCardStats>
        {stats.map(stat => (
          <div key={stat.label}>
            <dt>{stat.label}</dt>
            <CharacterCardValue
              $color={morto ? "var(--ink-muted)" : stat.color}
            >
              {stat.value}
            </CharacterCardValue>
          </div>
        ))}
      </CharacterCardStats>
      <CharacterCardMeta>
        Último parágrafo <b>{ultimoParagrafo ? `§ ${ultimoParagrafo}` : "—"}</b>
      </CharacterCardMeta>
      {morto && <CharacterCardStamp>Morto</CharacterCardStamp>}
    </CharacterCard>
  );
};

export const CharacterCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--space-sm);

  ${media.mobile} {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const CharacterCard = styled(Link)`
  ${FocusCssStyle}
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  padding: var(--space-md);
  color: var(--ink);
  text-decoration: none;
  background: var(--surface-raised);
  border: 1px solid var(--line);
  border-radius: var(--fp-radius);
  box-shadow: var(--shadow-raised);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  /* Sol Oculto: ficha de arquivo, com o filete duplo no topo */
  [data-theme="sol-oculto"] & {
    border-top: 4px double var(--line);
  }

  /* Lobisomem: moldura dupla de ferro */
  [data-theme="lobisomem"] & {
    margin: 4px;
    outline: 1px solid var(--hairline);
    outline-offset: 3px;
  }

  [data-theme="lobisomem"] &:focus-visible {
    outline: 3px solid var(--focus);
  }
`;

const CharacterCardNome = styled.h2`
  padding-right: 90px;
  font-family: var(--fp-heading-font);
  font-weight: var(--fp-heading-weight);
  font-size: 24px;
  line-height: 30px;
  overflow-wrap: anywhere;
`;

const CharacterCardStats = styled.dl`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-xs);

  div {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  dt {
    ${LabelCssStyle}
    font-size: 13px;
    line-height: 16px;
  }
`;

const CharacterCardValue = styled.dd<{ $color: string }>`
  font-family: var(--fp-stat-font);
  font-weight: var(--fp-stat-weight);
  font-size: 24px;
  line-height: 28px;
  font-variant-numeric: tabular-nums lining-nums;
  color: ${({ $color }) => $color};
`;

const CharacterCardMeta = styled.span`
  padding-top: var(--space-xs);
  font-size: 15px;
  line-height: 20px;
  color: var(--ink-muted);
  border-top: 1px solid var(--hairline);

  b {
    font-family: var(--fp-stat-font);
    font-weight: var(--fp-stat-weight);
    color: var(--ink);
  }
`;

const CharacterCardStamp = styled.span`
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  padding: 2px 8px;
  font-family: var(--fp-label-font);
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--danger);
  border: 2px solid var(--danger);
  border-radius: var(--fp-radius);
  transform: rotate(var(--fp-stamp-rotate));
`;

export default CharacterCardComponent;
