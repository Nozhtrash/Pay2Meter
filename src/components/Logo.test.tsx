import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Logo from './Logo';

describe('Logo', () => {
  it('renders the logo with the correct text', () => {
    render(<Logo />);
    
    // Check if the component renders the brand name
    const headingElement = screen.getByRole('heading', {
      name: /pay2meter/i,
    });
    expect(headingElement).toBeInTheDocument();
    
    // Check if it's a link pointing to the homepage
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('href', '/');
  });

  it('contains the shield icon', () => {
    const { container } = render(<Logo />);
    // lucide-react icons are rendered as SVGs. We can check if an SVG is present.
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });
});
