/** @jsxImportSource @emotion/react */
import { useMantineTheme, Box } from '@mantine/core';
import { Button } from '../../atoms/Button';
import { CardProps } from './Card.types';
import { createCardStyles } from './Card.styles';

export const Card = ({
  title,
  children,
  footer,
  actionText,
  onAction,
}: CardProps) => {
  const theme = useMantineTheme();
  const styles = createCardStyles(theme);

  return (
    <Box css={styles.card}>
      {title && <Box css={styles.header}>{title}</Box>}
      <Box css={styles.content}>{children}</Box>
      {(footer || actionText) && (
        <Box css={styles.footer}>
          {footer}
          {actionText && onAction && (
            <Button customVariant="primary" onClick={onAction}>
              {actionText}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}; 