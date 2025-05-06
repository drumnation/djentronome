/** @jsxImportSource @emotion/react */
import { useMantineTheme, Box, Group, Text } from '@mantine/core';
import { FooterProps } from './Footer.types';
import { createFooterStyles } from './Footer.styles';

export const Footer = ({ 
  version = 'v0.1.0', 
  companyName = 'Djentronome',
  year = new Date().getFullYear()
}: FooterProps) => {
  const theme = useMantineTheme();
  const styles = createFooterStyles(theme);

  return (
    <Box component="footer" css={styles.footer}>
      <div css={styles.footerSection}>
        <Text size="xs">© {year} {companyName}</Text>
      </div>
      
      <Group gap="md" css={styles.footerSection}>
        <Text size="xs">Version {version}</Text>
      </Group>
    </Box>
  );
}; 