import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hello } from './Hello';

describe('Hello component', () => {
  it('renders with default name', () => {
    render(<Hello />);
    expect(screen.getByText('Hello World')).toBeDefined();
  });

  it('renders with custom name', () => {
    render(<Hello name="Test" />);
    expect(screen.getByText('Hello Test')).toBeDefined();
  });
}); 