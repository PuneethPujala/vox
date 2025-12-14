import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home Page', () => {
  it('renders the welcome heading', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { name: /Welcome to Vox/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the features section', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: /Fast Development/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Beautiful UI/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Type-Safe Database/i })).toBeInTheDocument();
  });

  it('renders the getting started section', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: /Getting Started/i })).toBeInTheDocument();
  });
});
