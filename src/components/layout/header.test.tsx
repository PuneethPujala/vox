import { render, screen } from '@testing-library/react';
import { Header } from './header';

describe('Header', () => {
  it('renders the Vox branding', () => {
    render(<Header />);
    expect(screen.getByText('Vox')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });
});
