import { createGlobalStyle } from "styled-components";
import { tokens } from "./tokens";

const GlobalStyle = createGlobalStyle`
  ${tokens}

  body {
    margin: 0;
    padding: 0;

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
  }

  body,
  [data-theme] {
    background: var(--surface);
    color: var(--ink);
    font-family: var(--fp-body-font);
    font-size: var(--fp-body-size);
    line-height: var(--fp-body-lh);
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;

export default GlobalStyle;
