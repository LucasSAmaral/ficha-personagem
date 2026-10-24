import React from "react";
import styled from "styled-components";
import { AutoSaveStatus } from "../hooks/useAutoSave";
import { LabelCssStyle } from "../theme/tokens";

const mensagem = (status: AutoSaveStatus, online: boolean) => {
  if (!online && (status === "pending" || status === "saving")) {
    return "Sem conexão. As mudanças ficam no aparelho e são enviadas quando a conexão voltar.";
  }

  switch (status) {
    case "pending":
    case "saving":
      return "Salvando…";
    case "saved":
      return "Ficha salva";
    case "error":
      return "Não foi possível salvar. Tentando de novo…";
    default:
      return "As mudanças são salvas automaticamente";
  }
};

const AutoSaveStatusComponent: React.FC<{
  status: AutoSaveStatus;
  online: boolean;
}> = ({ status, online }) => {
  return (
    <AutoSaveStatusWrapper role="status" $error={status === "error"}>
      {mensagem(status, online)}
    </AutoSaveStatusWrapper>
  );
};

const AutoSaveStatusWrapper = styled.p<{ $error: boolean }>`
  ${LabelCssStyle}
  grid-area: salvar;
  padding-top: var(--space-md);
  text-align: center;
  border-top: 1px solid var(--hairline);
  color: ${({ $error }) => ($error ? "var(--danger)" : "var(--ink-muted)")};

  [data-theme="lobisomem"] & {
    border-top: 3px double var(--line);
  }
`;

export default AutoSaveStatusComponent;
