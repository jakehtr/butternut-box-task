import { render, screen } from '@testing-library/react';
import App from './App';

beforeAll(() => {
  jest.useFakeTimers('modern');
  jest.setSystemTime(new Date(2021, 9, 1));
});

afterAll(() => {
  jest.useRealTimers();
});

test('renders date picker', () => {
  render(<App />);

  screen.getByText('Choose your delivery day');
  screen.getByText('Delivery is always free');
  screen.getByText('Sun, 3 October');
  screen.getByText('Earliest delivery');
});
