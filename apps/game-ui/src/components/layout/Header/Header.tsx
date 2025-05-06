/** @jsxImportSource @emotion/react */
import { Burger, ActionIcon, useMantineTheme, Box, Group } from '@mantine/core';
import { HeaderProps } from './Header.types';
import { createHeaderStyles } from './Header.styles';
import { useState } from 'react';

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const theme = useMantineTheme();
  const styles = createHeaderStyles(theme);
  const [opened, setOpened] = useState(false);

  const handleToggle = () => {
    setOpened(!opened);
    onToggleSidebar();
  };

  return (
    <Box component="header" css={styles.header}>
      <Box hiddenFrom="md">
        <Burger
          opened={opened}
          onClick={handleToggle}
          color={theme.white}
          aria-label="Toggle navigation"
        />
      </Box>
      
      <div css={styles.logo}>DJENTRONOME</div>
      
      <Group gap="md" css={styles.navSection}>
        <ActionIcon variant="transparent" color="white" size="lg" aria-label="Settings">
          {/* Icon would go here */}
          S
        </ActionIcon>
        <ActionIcon variant="transparent" color="white" size="lg" aria-label="User profile">
          {/* Icon would go here */}
          U
        </ActionIcon>
      </Group>
    </Box>
  );
}; 