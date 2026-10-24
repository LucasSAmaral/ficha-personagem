import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { BookTheme, FocusCssStyle, LabelCssStyle } from "../theme/tokens";

type BookTileComponentProps = {
  to: string;
  theme: BookTheme;
  kind: string;
  title: string;
  meta?: string;
  soon?: boolean;
};

const BookTileComponent: React.FC<BookTileComponentProps> = ({
  to,
  theme,
  kind,
  title,
  meta,
  soon = false
}) => {
  return (
    <BookTile to={to} data-theme={theme}>
      <BookTileKind>{kind}</BookTileKind>
      <BookTileTitle>{title}</BookTileTitle>
      {meta && <BookTileMeta $soon={soon}>{meta}</BookTileMeta>}
    </BookTile>
  );
};

const BookTile = styled(Link)`
  ${FocusCssStyle}
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: var(--space-2xs);
  min-width: 0;
  min-height: 150px;
  padding: var(--space-md);
  color: var(--ink);
  text-decoration: none;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--fp-radius);
  box-shadow: var(--shadow-raised);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &[data-theme="sol-oculto"] {
    border-top: 4px double var(--line);
  }

  &[data-theme="lobisomem"] {
    outline: 1px solid var(--hairline);
    outline-offset: 3px;
  }

  &[data-theme="lobisomem"]:focus-visible {
    outline: 3px solid var(--focus);
  }
`;

const BookTileKind = styled.span`
  ${LabelCssStyle}
  font-size: 13px;
  line-height: 16px;
`;

const BookTileTitle = styled.span`
  font-family: var(--fp-title-font);
  font-weight: var(--fp-title-weight);
  font-size: 30px;
  line-height: 34px;
  text-wrap: balance;
`;

const BookTileMeta = styled.span<{ $soon: boolean }>`
  font-size: 15px;
  line-height: 20px;
  font-style: ${({ $soon }) => ($soon ? "italic" : "normal")};
  color: ${({ $soon }) => ($soon ? "var(--ink-muted)" : "var(--accent-ink)")};
`;

export default BookTileComponent;
