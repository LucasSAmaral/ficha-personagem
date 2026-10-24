import React from "react";
import styled from "styled-components";
import { BookTheme } from "../theme/tokens";

const ThemeScopeComponent: React.FC<{
  theme: BookTheme;
  children: React.ReactNode;
}> = ({ theme, children }) => {
  return <ThemeScope data-theme={theme}>{children}</ThemeScope>;
};

const ThemeScope = styled.div`
  min-height: 100vh;
`;

export default ThemeScopeComponent;
