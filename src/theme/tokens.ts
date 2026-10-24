import { css } from "styled-components";

// Tokens do design system "Ficha Personagem".
// Qualquer elemento com data-theme vira um escopo de tema (ver ThemeScope).
export type BookTheme = "ficha" | "sol-oculto" | "lobisomem";

export const media = {
  mobile: "@media (max-width: 425px)"
};

export const tokens = css`
  :root,
  [data-theme="ficha"] {
    --surface: #e7e4e0;
    --surface-raised: #f5f3f0;
    --surface-sunken: #d9d5d0;
    --ink: #1f1716;
    --ink-muted: #5a4f4b;
    --line: #7f7570;
    --hairline: #cbc5c0;
    --accent: #310303;
    --on-accent: #f3e9e1;
    --accent-ink: #6b1212;
    --danger: #9a1d12;
    --stat-vital: #9a1d12;
    --stat-mind: #34466e;
    --stat-coin: #6a5213;
    --focus: #6b1212;
    --shadow-raised: 0 1px 2px rgba(31, 23, 22, 0.12),
      0 6px 16px rgba(31, 23, 22, 0.08);

    --fp-title-font: var(--font-ficha-display);
    --fp-title-size: 40px;
    --fp-title-lh: 44px;
    --fp-title-weight: 800;
    --fp-heading-font: var(--font-ficha-display);
    --fp-heading-weight: 800;
    --fp-label-font: var(--font-ficha-display);
    --fp-label-weight: 500;
    --fp-label-track: 0.06em;
    --fp-label-case: none;
    --fp-body-font: var(--font-ficha-body);
    --fp-body-size: 16px;
    --fp-body-lh: 24px;
    --fp-stat-font: var(--font-ficha-display);
    --fp-stat-weight: 800;
    --fp-button-font: var(--font-ficha-display);
    --fp-button-weight: 800;
    --fp-button-track: 0.08em;
    --fp-button-case: uppercase;
    --fp-button-size: 15px;
    --fp-button-inset: none;
    --fp-radius: var(--radius-md);
    --fp-stamp-rotate: 0deg;
  }

  [data-theme="sol-oculto"] {
    --surface: #e3e1d1;
    --surface-raised: #efede1;
    --surface-sunken: #d4d1bc;
    --ink: #1b2220;
    --ink-muted: #4b5650;
    --line: #6f725f;
    --hairline: #bdbba6;
    --accent: #1d4a44;
    --on-accent: #e8eee4;
    --accent-ink: #1d4a44;
    --danger: #7c1d17;
    --stat-vital: #7c1d17;
    --stat-mind: #4a3768;
    --stat-coin: #5f4f12;
    --focus: #1d4a44;
    --shadow-raised: 2px 2px 0 rgba(27, 34, 32, 0.16);

    --fp-title-font: var(--font-sol-display);
    --fp-title-size: 40px;
    --fp-title-lh: 46px;
    --fp-title-weight: 400;
    --fp-heading-font: var(--font-sol-display);
    --fp-heading-weight: 400;
    --fp-label-font: var(--font-sol-type);
    --fp-label-weight: 400;
    --fp-label-track: 0.04em;
    --fp-label-case: uppercase;
    --fp-body-font: var(--font-sol-body);
    --fp-body-size: 18px;
    --fp-body-lh: 27px;
    --fp-stat-font: var(--font-sol-type);
    --fp-stat-weight: 400;
    --fp-button-font: var(--font-sol-type);
    --fp-button-weight: 400;
    --fp-button-track: 0.12em;
    --fp-button-case: uppercase;
    --fp-button-size: 15px;
    --fp-button-inset: none;
    --fp-radius: var(--radius-sm);
    --fp-stamp-rotate: -7deg;
  }

  [data-theme="lobisomem"] {
    color-scheme: dark;
    --surface: #121411;
    --surface-raised: #1c1f1a;
    --surface-sunken: #0b0c0a;
    --ink: #e6e1d3;
    --ink-muted: #a19d8e;
    --line: #70746a;
    --hairline: #2a2e27;
    --accent: #a3271c;
    --on-accent: #f6ede3;
    --accent-ink: #e88a6f;
    --danger: #ec7461;
    --stat-vital: #ec7461;
    --stat-mind: #a9bccf;
    --stat-coin: #d6b25a;
    --focus: #e9c46a;
    --shadow-raised: 0 10px 24px rgba(0, 0, 0, 0.55);

    --fp-title-font: var(--font-lobo-display);
    --fp-title-size: 44px;
    --fp-title-lh: 48px;
    --fp-title-weight: 700;
    --fp-heading-font: var(--font-lobo-display);
    --fp-heading-weight: 600;
    --fp-label-font: var(--font-lobo-label);
    --fp-label-weight: 700;
    --fp-label-track: 0.08em;
    --fp-label-case: none;
    --fp-body-font: var(--font-lobo-body);
    --fp-body-size: 17px;
    --fp-body-lh: 26px;
    --fp-stat-font: var(--font-lobo-display);
    --fp-stat-weight: 700;
    --fp-button-font: var(--font-lobo-label);
    --fp-button-weight: 700;
    --fp-button-track: 0.1em;
    --fp-button-case: none;
    --fp-button-size: 16px;
    /* filete gravado por dentro, como uma placa de ferro */
    --fp-button-inset: inset 0 0 0 3px var(--accent),
      inset 0 0 0 4px var(--on-accent);
    --fp-radius: var(--radius-none);
    --fp-stamp-rotate: 0deg;
  }

  :root {
    --brand-bone: #e7e4e0;
    --brand-maroon: #310303;
    --brand-abyss: #1d4a44;
    --brand-blood: #a3271c;
    --brand-night: #121411;
    --brand-candle: #d6b25a;

    --space-2xs: 5px;
    --space-xs: 10px;
    --space-sm: 15px;
    --space-md: 20px;
    --space-lg: 30px;
    --space-xl: 50px;

    --radius-none: 0;
    --radius-sm: 2px;
    --radius-md: 8px;
    --radius-pill: 999px;

    --page-max: 600px;
    --sheet-max: 760px;
    --control-min: 44px;

    --font-ficha-display: "Alegreya Sans SC", "Alegreya Sans", system-ui,
      sans-serif;
    --font-ficha-body: "Alegreya Sans", system-ui, sans-serif;
    --font-sol-display: "IM Fell English", "Iowan Old Style", Georgia, serif;
    --font-sol-body: "Crimson Pro", Georgia, serif;
    --font-sol-type: "Special Elite", "Courier New", Courier, monospace;
    --font-lobo-display: "Grenze Gotisch", "Old English Text MT", Georgia, serif;
    --font-lobo-body: "Alegreya", Georgia, serif;
    --font-lobo-label: "Alegreya SC", "Alegreya", Georgia, serif;
  }
`;

// Estilos compartilhados pelos rótulos (campos, atributos, metadados).
export const LabelCssStyle = css`
  font-family: var(--fp-label-font);
  font-weight: var(--fp-label-weight);
  letter-spacing: var(--fp-label-track);
  text-transform: var(--fp-label-case);
  font-size: 14px;
  line-height: 18px;
  color: var(--ink-muted);
`;

export const FocusCssStyle = css`
  &:focus-visible {
    outline: 3px solid var(--focus);
    outline-offset: 2px;
  }
`;
