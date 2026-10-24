import React from "react";
import { Control, Controller } from "react-hook-form";
import styled, { css } from "styled-components";
import { PersonagemStateProps } from "../pages/enigma-sol-oculto/enigma-sol-oculto-personagem.component";
import { LabelCssStyle } from "../theme/tokens";

type FormInputFields =
  | "displayName"
  | "email"
  | "password"
  | "confirmPassword"
  | "Nome"
  | "saude"
  | "sanidade"
  | "dinheiro"
  | "habilidade"
  | "energia"
  | "sorte"
  | "ouro"
  | "provisoes";

export type FormData = {
  email: string;
  password: string;
  displayName?: string;
  confirmPassword?: string;
};

type PersonagemFormData = Pick<PersonagemStateProps, "Nome"> & {
  dinheiro: string;
  sanidade: string;
  saude: string;
};

type LobisomemFormData = Pick<PersonagemStateProps, "Nome"> & {
  habilidade: string;
  energia: string;
  sorte: string;
  ouro: string;
  provisoes: string;
};

export type ControlFormData = FormData | PersonagemFormData | LobisomemFormData;

type FormInputComponentProps = {
  control: Control<ControlFormData, any>;
  name: FormInputFields;
  type: React.HTMLInputTypeAttribute;
  required?: boolean;
  label?: string;
  error?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
};

const FormInputComponent: React.FC<FormInputComponentProps> = ({
  label,
  control,
  name,
  type,
  required,
  error,
  autoComplete,
  inputMode
}) => {
  const id = `campo-${name}`;
  const errorId = `${id}-erro`;

  return (
    <FieldWrapper>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <Controller
        render={({ field }) => (
          <FieldInput
            {...field}
            id={id}
            type={type}
            required={required}
            autoComplete={autoComplete}
            inputMode={inputMode}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            $error={Boolean(error)}
          />
        )}
        name={name}
        control={control}
        defaultValue=""
      />
      {error && <FieldHint id={errorId}>{error}</FieldHint>}
    </FieldWrapper>
  );
};

export const FieldWrapper = styled.div<{ $area?: string }>`
  grid-area: ${({ $area }) => $area || "auto"};
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
  min-width: 0;
`;

export const FieldLabel = styled.label`
  ${LabelCssStyle}
`;

const controlStyle = css<{ $error?: boolean }>`
  width: 100%;
  min-height: var(--control-min);
  padding: var(--space-xs) 12px;
  font: inherit;
  color: var(--ink);
  background: var(--surface-raised);
  border: 1px solid
    ${({ $error }) => ($error ? "var(--danger)" : "var(--line)")};
  border-radius: var(--fp-radius);

  &:focus-visible {
    outline: 3px solid var(--focus);
    outline-offset: 2px;
  }
`;

export const FieldInput = styled.input<{ $error?: boolean }>`
  ${controlStyle}

  /* Sol Oculto: a linha de um formulário de dossiê */
  [data-theme="sol-oculto"] & {
    padding-inline: 2px;
    background: transparent;
    border-width: 0 0 1px;
    border-radius: 0;
  }
`;

export const FieldTextArea = styled.textarea<{ $error?: boolean }>`
  ${controlStyle}
  min-height: 160px;
  resize: vertical;

  /* Sol Oculto: o bloco de notas é pautado */
  [data-theme="sol-oculto"] & {
    padding-top: 0;
    line-height: 27px;
    background-image: repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent 26px,
      var(--hairline) 26px,
      var(--hairline) 27px
    );
    background-attachment: local;
  }
`;

export const FieldHint = styled.span`
  font-size: 15px;
  line-height: 20px;
  color: var(--danger);
`;

export default FormInputComponent;
