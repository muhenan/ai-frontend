import React, { useState, useCallback } from 'react';
import { getDaysMatrix, getCurrentYearMonth, formatMonthYear, MONTH_NAMES, WEEKDAY_NAMES } from '../utils/calendarHelpers';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { dateToDateKey } from '../utils/dateHelpers';
import type { CalendarState, CalendarNavigationHandlers } from '../types/calendar';
import type { DateKey } from '../types/notes';

interface CalendarProps {
  selectedDateKey?: DateKey | null;
  onDateClick?: (dateKey: DateKey) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDateKey, onDateClick }) => {
  const [calendarState, setCalendarState] = useState<CalendarState>(() => {
    const { year, month } = getCurrentYearMonth();
    return { currentYear: year, currentMonth: month };
  });

  const navigationHandlers: CalendarNavigationHandlers = {
    goPrevMonth: useCallback(() => {
      setCalendarState(prev => {
        const newMonth = prev.currentMonth - 1;
        if (newMonth < 0) {
          return { currentYear: prev.currentYear - 1, currentMonth: 11 };
        }
        return { ...prev, currentMonth: newMonth };
      });
    }, []),

    goNextMonth: useCallback(() => {
      setCalendarState(prev => {
        const newMonth = prev.currentMonth + 1;
        if (newMonth > 11) {
          return { currentYear: prev.currentYear + 1, currentMonth: 0 };
        }
        return { ...prev, currentMonth: newMonth };
      });
    }, []),

    goToday: useCallback(() => {
      const { year, month } = getCurrentYearMonth();
      setCalendarState({ currentYear: year, currentMonth: month });
    }, []),

    setMonth: useCallback((month: number) => {
      setCalendarState(prev => ({ ...prev, currentMonth: month }));
    }, []),

    setYear: useCallback((year: number) => {
      setCalendarState(prev => ({ ...prev, currentYear: year }));
    }, [])
  };

  const daysMatrix = getDaysMatrix(calendarState.currentYear, calendarState.currentMonth);

  useKeyboardNavigation({ navigationHandlers });

  const handleDateClick = useCallback((date: Date) => {
    const dateKey = dateToDateKey(date);
    onDateClick?.(dateKey);
  }, [onDateClick]);

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 50; year <= currentYear + 50; year++) {
      years.push(year);
    }
    return years;
  };

  return (
    <div className="calendar" aria-label="Month calendar">
      <div className="calendar-header">
        <div className="calendar-navigation">
          <button
            onClick={navigationHandlers.goPrevMonth}
            aria-label="Previous month"
            className="nav-button"
          >
            &#8249;
          </button>
          
          <div className="calendar-title">
            <select
              value={calendarState.currentMonth}
              onChange={(e) => navigationHandlers.setMonth(Number(e.target.value))}
              aria-label="Change month"
              className="month-select"
            >
              {MONTH_NAMES.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>
            
            <select
              value={calendarState.currentYear}
              onChange={(e) => navigationHandlers.setYear(Number(e.target.value))}
              aria-label="Change year"
              className="year-select"
            >
              {generateYearOptions().map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={navigationHandlers.goNextMonth}
            aria-label="Next month"
            className="nav-button"
          >
            &#8250;
          </button>
        </div>

        <button
          onClick={navigationHandlers.goToday}
          aria-label="Go to today"
          className="today-button"
        >
          Today
        </button>
      </div>

      <h1 className="visually-hidden">
        {formatMonthYear(calendarState.currentYear, calendarState.currentMonth)}
      </h1>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {WEEKDAY_NAMES.map(day => (
            <div key={day} className="weekday-header">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-days">
          {daysMatrix.map((week, weekIndex) => (
            <div key={weekIndex} className="calendar-week">
              {week.map((day, dayIndex) => (
                day.isCurrentMonth ? (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`calendar-day current-month ${day.isToday ? 'today' : ''} ${
                      selectedDateKey && dateToDateKey(day.date) === selectedDateKey ? 'selected' : ''
                    }`}
                    onClick={() => handleDateClick(day.date)}
                  >
                    {day.dayNumber}
                  </div>
                ) : (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className="calendar-day placeholder"
                    aria-hidden="true"
                  >
                  </div>
                )
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;