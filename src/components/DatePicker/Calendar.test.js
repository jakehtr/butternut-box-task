import { fireEvent, render, screen } from '@testing-library/react';

import Calendar from './Calendar';

const mockDate = new Date(2021, 9, 1);
const selectedDate = new Date(2021, 9, 2);

beforeAll(() => {
  jest.useFakeTimers('modern');
  jest.setSystemTime(mockDate);
});

afterAll(() => {
  jest.useRealTimers();
});

test('displays the month, year, and weekdays correctly', () => {
  render(<Calendar selectedDate={selectedDate} />);

  screen.getByText('October 2021');
  screen.getByText('M');
  screen.getByText('W');
  screen.getByText('F');
  expect(screen.getAllByText('T')).toHaveLength(2);
  expect(screen.getAllByText('S')).toHaveLength(2);
});

test('displays days of month correctly', () => {
  render(<Calendar selectedDate={selectedDate} />);

  const days = screen.getAllByTestId('day-button');

  expect(days).toHaveLength(31);
  expect(days[1]).toHaveClass('selected');
});

test('selects day on click', () => {
  render(<Calendar selectedDate={selectedDate} />);

  const days = screen.getAllByTestId('day-button');

  fireEvent.click(days[4]);
  expect(days[1]).not.toHaveClass('selected');
  expect(days[4]).toHaveClass('selected');
});

test('excludes unavailable days correctly', () => {
  const unavailableWeekdays = [2, 5];
  const firstWeekday = mockDate.getDay();

  render(
    <Calendar
      selectedDate={selectedDate}
      unavailableWeekdays={unavailableWeekdays}
    />
  );

  const days = screen.getAllByTestId('day-button');
  const availableDays = [];
  const unavailableDays = [];

  days.forEach((day, i) => {
    if (
      firstWeekday + i + 1 === mockDate.getDate() ||
      unavailableWeekdays.indexOf((firstWeekday + i) % 7) !== -1
    ) {
      unavailableDays.push(day);
    } else {
      availableDays.push(day);
    }
  });

  unavailableDays.forEach((day) => expect(day).toBeDisabled());
  availableDays.forEach((day) => expect(day).not.toBeDisabled());
});

test('calls onChange prop on cancel', () => {
  const onChange = jest.fn();

  render(<Calendar selectedDate={mockDate} onChange={onChange} />);

  fireEvent.click(screen.getByText("CANCEL, DON'T CHANGE"));
  expect(onChange).toHaveBeenCalled();
});

test('calls onChange prop with expected arguments on confirm', () => {
  const onChange = jest.fn();

  render(<Calendar selectedDate={mockDate} onChange={onChange} />);

  const days = screen.getAllByTestId('day-button');

  fireEvent.click(days[4]);
  fireEvent.click(screen.getByText('CHANGE DATE'));
  expect(onChange).toHaveBeenCalledWith(
    new Date(mockDate.getFullYear(), mockDate.getMonth(), 5)
  );
});
