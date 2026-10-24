import styled from "styled-components";
import { media } from "../theme/tokens";

const Page = styled.main<{ $wide?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  max-width: ${({ $wide }) => ($wide ? "var(--sheet-max)" : "var(--page-max)")};
  margin: 0 auto;
  padding: var(--space-xl) var(--space-md);

  ${media.mobile} {
    padding: var(--space-md) var(--space-md) var(--space-xl);
  }
`;

export default Page;
