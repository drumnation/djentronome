import { css } from '@emotion/react';
import { MantineTheme } from '@mantine/core';
import { ButtonProps } from './Button.types';

export const createButtonStyles = (theme: MantineTheme, props: ButtonProps) => {
  const { customVariant } = props;
  const djentRed = theme.colors.djentRed || [];
  const accentColor = theme.other.accentColor as string;

  const customVariantStyles = (() => {
    switch (customVariant) {
      case 'primary':
        return css`
          background-color: ${accentColor};
          color: ${theme.white};
          font-family: 'Rajdhani', sans-serif;
          letter-spacing: 0.5px;
          font-weight: 500;
          text-transform: uppercase;
          box-shadow: 0 0 15px rgba(230, 0, 0, 0.3);
          transition: all 0.2s ease;

          &:hover {
            background-color: ${djentRed[7] || '#800000'};
            box-shadow: 0 0 20px rgba(230, 0, 0, 0.5);
            transform: translateY(-1px);
          }
        `;
      case 'secondary':
        return css`
          background-color: rgba(230, 0, 0, 0.1);
          color: ${accentColor};
          border: 1px solid ${accentColor};
          font-family: 'Rajdhani', sans-serif;
          letter-spacing: 0.5px;
          font-weight: 500;
          text-transform: uppercase;
          transition: all 0.2s ease;

          &:hover {
            background-color: rgba(230, 0, 0, 0.15);
            box-shadow: 0 0 15px rgba(230, 0, 0, 0.2);
            transform: translateY(-1px);
          }
        `;
      case 'tertiary':
        return css`
          background-color: transparent;
          color: ${accentColor};
          font-family: 'Rajdhani', sans-serif;
          letter-spacing: 0.5px;
          font-weight: 500;
          text-transform: uppercase;
          transition: all 0.2s ease;

          &:hover {
            background-color: rgba(230, 0, 0, 0.05);
            text-shadow: 0 0 8px rgba(230, 0, 0, 0.5);
            transform: translateY(-1px);
          }
        `;
      default:
        return css``;
    }
  })();

  return {
    button: customVariant ? customVariantStyles : css``,
  };
}; 