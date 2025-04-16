import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the main layout', () => {
  render(<App />);
  const appElement = screen.getByText(/dashboard|home|register/i);
  expect(appElement).toBeInTheDocument();
});
