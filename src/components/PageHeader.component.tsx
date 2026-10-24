import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FocusCssStyle, LabelCssStyle } from "../theme/tokens";

type PageHeaderComponentProps = {
  title: string;
  eyebrow?: string;
  back?: { to: string; label: string };
};

const PageHeaderComponent: React.FC<PageHeaderComponentProps> = ({
  title,
  eyebrow,
  back
}) => {
  return (
    <PageHeader>
      {back && (
        <PageHeaderBack to={back.to}>
          <span aria-hidden="true">‹</span> {back.label}
        </PageHeaderBack>
      )}
      {eyebrow && <PageHeaderEyebrow>{eyebrow}</PageHeaderEyebrow>}
      <PageHeaderTitle>{title}</PageHeaderTitle>
    </PageHeader>
  );
};

const PageHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--hairline);

  [data-theme="lobisomem"] & {
    border-bottom: 3px double var(--line);
  }
`;

const PageHeaderBack = styled(Link)`
  ${LabelCssStyle}
  ${FocusCssStyle}
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: var(--control-min);
  color: var(--accent-ink);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const PageHeaderEyebrow = styled.p`
  ${LabelCssStyle}
`;

const PageHeaderTitle = styled.h1`
  font-family: var(--fp-title-font);
  font-weight: var(--fp-title-weight);
  font-size: var(--fp-title-size);
  line-height: var(--fp-title-lh);
  text-wrap: balance;
  overflow-wrap: anywhere;
`;

export default PageHeaderComponent;
