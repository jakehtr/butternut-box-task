import { fireEvent, render, screen } from '@testing-library/react';

import DatePicker from './DatePicker';

beforeAll(() => {
  jest.useFakeTimers('modern');
  jest.setSystemTime(new Date(2021, 9, 1));
});

afterAll(() => {
  jest.useRealTimers();
});

test('loads and displays header text', () => {
  render(<DatePicker />);

  screen.getByText('Choose your delivery day');
  screen.getByText('Delivery is always free');
});

test('displays start date correctly', () => {
  render(<DatePicker />);

  screen.getByText('Sat, 2 October');
  screen.getByText('Earliest delivery');
});

test('displays start date correctly with unavailable weekdays', () => {
  render(<DatePicker unavailableWeekdays={[5, 6]} />);

  screen.getByText('Sun, 3 October');
  screen.getByText('Earliest delivery');
});

test('opens calendar when clicking calendar button', () => {
  render(<DatePicker />);

  fireEvent.click(screen.getByText('Change'));
  screen.getByTestId('datepicker-calendar');
});

test('changes date and earliest delivery time on date change', () => {
  render(<DatePicker />);

  screen.getByText('Sat, 2 October');
  screen.getByText('Earliest delivery');
  fireEvent.click(screen.getByText('Change'));
  screen.getByTestId('datepicker-calendar');

  const days = screen.getAllByTestId('day-button');

  fireEvent.click(days[4]);
  fireEvent.click(screen.getByText('CHANGE DATE'));
  expect(screen.queryByTestId('datepicker-calendar')).not.toBeInTheDocument();
  screen.getByText('Tue, 5 October');
  expect(screen.queryByText('Earliest delivery')).not.toBeInTheDocument();
});
