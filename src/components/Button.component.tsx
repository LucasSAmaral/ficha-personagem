import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { ButtonCssStyle, QuietButtonCssStyle } from "../theme/styles";

type ButtonVariantProps = {
  $quiet?: boolean;
  $inline?: boolean;
};

const variantStyle = css<ButtonVariantProps>`
  ${({ $quiet }) => ($quiet ? QuietButtonCssStyle : ButtonCssStyle)}
  ${({ $inline }) =>
    $inline &&
    css`
      width: auto;
      max-width: none;
      min-height: var(--control-min);
      padding: var(--space-xs) var(--space-md);
    `}
`;

export const Button = styled.button<ButtonVariantProps>`
  ${variantStyle}
`;

export const ButtonLink = styled(Link)<ButtonVariantProps>`
  ${variantStyle}
`;

export default Button;
