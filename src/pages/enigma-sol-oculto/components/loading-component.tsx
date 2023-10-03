import React from "react";
import styled from "styled-components";

const LoadingComponent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ className = "", children }) => {
  return (
    <Loading className={className}>
      <h2>{children}</h2>
    </Loading>
  );
};

const Loading = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  h2 {
    font-size: 50px;
  }
`;

export default LoadingComponent;
