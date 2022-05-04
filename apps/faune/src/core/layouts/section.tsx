import styled from "styled-components";
import { theme } from "~/styles/theme";

export const SectionTitle = styled.h2`
  margin: ${theme.spacing.x2} 0;
  padding: 0 ${theme.spacing.x2};
  font-family: ${theme.typography.fontFamily.title};
  font-size: 18px;
  font-weight: 700;
`;

export const Section = styled.section`
  padding: ${theme.spacing.x2};
`;

export const ButtonSection = styled.section`
  padding: ${theme.spacing.x4};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.x4};
`;

export const SectionBox = styled(Section)`
  margin: 0 ${theme.spacing.x4};
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.m};
`;
