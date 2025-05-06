/** @jsxImportSource @emotion/react */
import { Button as MantineButton, useMantineTheme } from '@mantine/core';
import { ButtonProps } from './Button.types';
import { createButtonStyles } from './Button.styles';

export const Button = ({ 
  customVariant,
  children,
  ...restProps
}: ButtonProps) => {
  const theme = useMantineTheme();
  const styles = createButtonStyles(theme, { customVariant });

  return (
    <MantineButton
      css={styles.button}
      {...restProps}
    >
      {children}
    </MantineButton>
  );
}; 