import { useEffect, useMemo, useRef, useState } from 'react';

import PropTypes from 'prop-types';

import { ReactComponent as CalendarIcon } from '../../assets/calendar.svg';
import { ReactComponent as VanIcon } from '../../assets/van.svg';
import Calendar from './Calendar';
import styles from './DatePicker.module.sass';

const DatePicker = ({ unavailableWeekdays }) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [date, setDate] = useState();
  const firstAvailableDate = useRef();

  const selectedDate = new Date(date);

  const uniqueUnavailableWeekdays = useMemo(
    () =>
      unavailableWeekdays.filter(
        (weekday, i) =>
          weekday >= 0 &&
          weekday < 7 &&
          unavailableWeekdays.indexOf(weekday) === i
      ),
    [unavailableWeekdays]
  );

  useEffect(() => {
    if (uniqueUnavailableWeekdays.length < 7) {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      let availableDate = new Date(year, month, now.getDate() + 1);

      if (availableDate.getMonth() === month) {
        while (
          uniqueUnavailableWeekdays.indexOf(availableDate.getDay()) !== -1
        ) {
          availableDate = new Date(year, month, availableDate.getDate() + 1);
        }

        firstAvailableDate.current = availableDate;
        setDate(availableDate);
      }
    }
  }, [uniqueUnavailableWeekdays]);

  const onChange = (date) => {
    date && setDate(date);
    setCalendarOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>
          Choose your delivery day
          <span>Delivery is always free</span>
        </h3>
      </div>
      <div className={styles.datePicker}>
        {date ? (
          <>
            <div className={styles.dateText}>
              <div>
                {selectedDate.toLocaleString('en-GB', {
                  weekday: 'short',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              {selectedDate.getDate() ===
              firstAvailableDate.current.getDate() ? (
                <div className={styles.earliestDeliveryTag}>
                  <VanIcon />
                  <span>Earliest delivery</span>
                </div>
              ) : null}
            </div>
            <div className={styles.selectDateContainer}>
              <button onClick={() => setCalendarOpen(true)}>
                <div className={styles.calendarIcon}>
                  <CalendarIcon />
                  <span>{selectedDate.getDate()}</span>
                </div>
                <div className={styles.selectDateText}>
                  <span>Change</span>
                </div>
              </button>
            </div>
            {calendarOpen && (
              <Calendar
                unavailableWeekdays={uniqueUnavailableWeekdays}
                onChange={onChange}
                selectedDate={date}
              />
            )}
          </>
        ) : (
          <span className={styles.dateText}>
            Apawlogies, no dates available!
          </span>
        )}
      </div>
    </div>
  );
};

DatePicker.propTypes = {
  unavailableWeekdays: PropTypes.arrayOf(PropTypes.number),
};

DatePicker.defaultProps = {
  unavailableWeekdays: [],
};

export default DatePicker;
