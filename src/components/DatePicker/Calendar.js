import { useState, useRef, useEffect } from 'react';

import PropTypes from 'prop-types';

import styles from './Calendar.module.sass';

const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const Calendar = ({ onChange, selectedDate, unavailableWeekdays }) => {
  const now = new Date();
  const currentDay = now.getDate();
  const firstDate = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  );
  const firstWeekday = firstDate.getDay() === 0 ? 7 : firstDate.getDay();
  const numberOfDays = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  ).getDate();

  const [selectedDay, setSelectedDay] = useState(selectedDate.getDate());
  const calendarRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        onCancel();
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });

  const onConfirm = () => {
    const newSelectedDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDay
    );
    onChange(newSelectedDate);
  };

  const onCancel = () => {
    onChange();
  };

  return (
    <div className={styles.container} data-testid="datepicker-calendar">
      <div className={styles.calendar} ref={calendarRef}>
        <h3>
          {selectedDate.toLocaleString('en-GB', {
            month: 'long',
            year: 'numeric',
          })}
        </h3>
        <div className={styles.calendarDays}>
          {weekdays.map((day, i) => (
            <div key={`${day}-${i}`} className={styles.weekday}>
              {day}
            </div>
          ))}
          {[...Array(numberOfDays)].map((_, i) => {
            const day = i + 1;
            const weekDay = (firstWeekday + i) % 7;
            const unavailableDay =
              day <= currentDay || unavailableWeekdays.indexOf(weekDay) !== -1;
            const selected = !unavailableDay && day === selectedDay;

            return (
              <button
                key={`day-${day}`}
                data-testid="day-button"
                className={selected ? styles.selected : null}
                style={day === 1 ? { gridColumnStart: firstWeekday } : null}
                onClick={() => setSelectedDay(day)}
                disabled={unavailableDay}
              >
                {day}
              </button>
            );
          })}
        </div>
        <div className={styles.actionButtons}>
          <button className={styles.cancelButton} onClick={onCancel}>
            CANCEL, DON'T CHANGE
          </button>
          <button className={styles.confirmButton} onClick={onConfirm}>
            CHANGE DATE
          </button>
        </div>
      </div>
    </div>
  );
};

Calendar.propTypes = {
  onChange: PropTypes.func,
  selectedDate: PropTypes.instanceOf(Date),
  unavailableWeekdays: PropTypes.arrayOf(PropTypes.number),
};

Calendar.defaultProps = {
  selectedDate: new Date(),
  unavailableWeekdays: [],
};

export default Calendar;
