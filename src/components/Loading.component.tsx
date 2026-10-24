import React from "react";
import styled, { keyframes } from "styled-components";

const LoadingComponent: React.FC<{
  children: React.ReactNode;
  fullPage?: boolean;
}> = ({ fullPage = false, children }) => {
  return (
    <Loading role="status" $fullPage={fullPage}>
      {children}
      <LoadingCaret aria-hidden="true" />
    </Loading>
  );
};

const blink = keyframes`
  50% {
    opacity: 0;
  }
`;

const Loading = styled.div<{ $fullPage: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: ${({ $fullPage }) => ($fullPage ? "100vh" : "160px")};
  font-family: var(--fp-heading-font);
  font-weight: var(--fp-heading-weight);
  font-size: 32px;
  line-height: 40px;
  text-align: center;
`;

const LoadingCaret = styled.span`
  display: inline-block;
  width: 0.5em;
  height: 0.9em;
  background: var(--accent-ink);
  animation: ${blink} 1.1s steps(1) infinite;
`;

export default LoadingComponent;
