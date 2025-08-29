import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isToday, isSameMonth } from 'date-fns';
import type { CalendarDay, CalendarMatrix } from '../types/calendar';

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const WEEKDAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function getDaysMatrix(year: number, month: number): CalendarMatrix {
  const targetDate = new Date(year, month);
  const monthStart = startOfMonth(targetDate);
  const monthEnd = endOfMonth(targetDate);
  
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });
  
  const calendarDays: CalendarDay[] = days.map(date => ({
    date,
    dayNumber: date.getDate(),
    isCurrentMonth: isSameMonth(date, targetDate),
    isToday: isToday(date)
  }));
  
  const matrix: CalendarMatrix = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    matrix.push(calendarDays.slice(i, i + 7));
  }
  
  return matrix;
}

export function isCurrentMonth(date: Date, year: number, month: number): boolean {
  return isSameMonth(date, new Date(year, month));
}

export function getCurrentYearMonth(): { year: number; month: number } {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth()
  };
}

export function formatMonthYear(year: number, month: number): string {
  return format(new Date(year, month), 'MMMM yyyy');
}