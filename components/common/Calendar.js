import { useState } from 'react';
import classNames from 'classnames';
import {
  startOfWeek,
  startOfMonth,
  startOfYear,
  endOfMonth,
  addDays,
  subDays,
  addYears,
  subYears,
  addMonths,
  setMonth,
  setYear,
  isSameDay,
  isBefore,
  isAfter,
} from 'date-fns';
import { Button, Icon, Icons } from 'react-basics';
import { chunkArray } from 'next-basics';
import useLocale from 'hooks/useLocale';
import { dateFormat } from 'lib/date';
import { getDateLocale } from 'lib/lang';
import styles from './Calendar.module.css';

export default function Calendar({ date, minDate, maxDate, onChange }) {
  const { locale } = useLocale();
  const [selectMonth, setSelectMonth] = useState(false);
  const [selectYear, setSelectYear] = useState(false);

  const month = dateFormat(date, 'MMMM', locale);
  const year = date.getFullYear();

  function toggleMonthSelect() {
    setSelectYear(false);
    setSelectMonth(state => !state);
  }

  function toggleYearSelect() {
    setSelectMonth(false);
    setSelectYear(state => !state);
  }

  function handleChange(value) {
    setSelectMonth(false);
    setSelectYear(false);
    if (value) {
      onChange(value);
    }
  }

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <div>{date.getDate()}</div>
        <div
          className={classNames(styles.selector, { [styles.open]: selectMonth })}
          onClick={toggleMonthSelect}
        >
          {month}
          <Icon className={styles.icon} size="small">
            {selectMonth ? <Icons.Close /> : <Icons.ChevronDown />}
          </Icon>
        </div>
        <div
          className={classNames(styles.selector, { [styles.open]: selectYear })}
          onClick={toggleYearSelect}
        >
          {year}
          <Icon className={styles.icon} size="small">
            {selectMonth ? <Icons.Close /> : <Icons.ChevronDown />}
          </Icon>
        </div>
      </div>
      <div className={styles.body}>
        {!selectMonth && !selectYear && (
          <DaySelector
            date={date}
            minDate={minDate}
            maxDate={maxDate}
            locale={locale}
            onSelect={handleChange}
          />
        )}
        {selectMonth && (
          <MonthSelector
            date={date}
            minDate={minDate}
            maxDate={maxDate}
            locale={locale}
            onSelect={handleChange}
            onClose={toggleMonthSelect}
          />
        )}
        {selectYear && (
          <YearSelector
            date={date}
            minDate={minDate}
            maxDate={maxDate}
            onSelect={handleChange}
            onClose={toggleYearSelect}
          />
        )}
      </div>
    </div>
  );
}

const DaySelector = ({ date, minDate, maxDate, locale, onSelect }) => {
  const dateLocale = getDateLocale(locale);
  const weekStartsOn = dateLocale?.options?.weekStartsOn || 0;
  const startWeek = startOfWeek(date, {
    locale: dateLocale,
    weekStartsOn,
  });
  const startMonth = startOfMonth(date);
  const startDay = subDays(startMonth, startMonth.getDay() - weekStartsOn);
  const month = date.getMonth();
  const year = date.getFullYear();

  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    daysOfWeek.push(addDays(startWeek, i));
  }

  const days = [];
  for (let i = 0; i < 35; i++) {
    days.push(addDays(startDay, i));
  }

  return (
    <table>
      <thead>
        <tr>
          {daysOfWeek.map((day, i) => (
            <th key={i} className={locale}>
              {dateFormat(day, 'EEE', locale)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {chunkArray(days, 7).map((week, i) => (
          <tr key={i}>
            {week.map((day, j) => {
              const disabled = isBefore(day, minDate) || isAfter(day, maxDate);
              return (
                <td
                  key={j}
                  className={classNames({
                    [styles.selected]: isSameDay(date, day),
                    [styles.faded]: day.getMonth() !== month || day.getFullYear() !== year,
                    [styles.disabled]: disabled,
                  })}
                  onClick={!disabled ? () => onSelect(day) : null}
                >
                  {day.getDate()}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const MonthSelector = ({ date, minDate, maxDate, locale, onSelect }) => {
  const start = startOfYear(date);
  const months = [];
  for (let i = 0; i < 12; i++) {
    months.push(addMonths(start, i));
  }

  function handleSelect(value) {
    onSelect(setMonth(date, value));
  }

  return (
    <table>
      <tbody>
        {chunkArray(months, 3).map((row, i) => (
          <tr key={i}>
            {row.map((month, j) => {
              const disabled =
                isBefore(endOfMonth(month), minDate) || isAfter(startOfMonth(month), maxDate);
              return (
                <td
                  key={j}
                  className={classNames(locale, {
                    [styles.selected]: month.getMonth() === date.getMonth(),
                    [styles.disabled]: disabled,
                  })}
                  onClick={!disabled ? () => handleSelect(month.getMonth()) : null}
                >
                  {dateFormat(month, 'MMMM', locale)}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const YearSelector = ({ date, minDate, maxDate, onSelect }) => {
  const [currentDate, setCurrentDate] = useState(date);
  const year = date.getFullYear();
  const currentYear = currentDate.getFullYear();
  const minYear = minDate.getFullYear();
  const maxYear = maxDate.getFullYear();
  const years = [];
  for (let i = 0; i < 15; i++) {
    years.push(currentYear - 7 + i);
  }

  function handleSelect(value) {
    onSelect(setYear(date, value));
  }

  function handlePrevClick() {
    setCurrentDate(state => subYears(state, 15));
  }

  function handleNextClick() {
    setCurrentDate(state => addYears(state, 15));
  }

  return (
    <div className={styles.pager}>
      <div className={styles.left}>
        <Button
          size="small"
          onClick={handlePrevClick}
          disabled={years[0] <= minYear}
          variant="light"
        >
          <Icon>
            <Icons.ChevronDown />
          </Icon>
        </Button>
      </div>
      <div className={styles.middle}>
        <table>
          <tbody>
            {chunkArray(years, 5).map((row, i) => (
              <tr key={i}>
                {row.map((n, j) => (
                  <td
                    key={j}
                    className={classNames({
                      [styles.selected]: n === year,
                      [styles.disabled]: n < minYear || n > maxYear,
                    })}
                    onClick={() => (n < minYear || n > maxYear ? null : handleSelect(n))}
                  >
                    {n}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.right}>
        <Button
          size="small"
          onClick={handleNextClick}
          disabled={years[years.length - 1] > maxYear}
          variant="light"
        >
          <Icon>
            <Icons.ChevronDown />
          </Icon>
        </Button>
      </div>
    </div>
  );
};
