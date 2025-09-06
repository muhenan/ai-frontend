import { describe, expect, it } from 'vitest';
import { formatMonthYear, getCurrentYearMonth, isCurrentMonth } from './calendarHelpers';

describe('calendarHelpers', () => {
  it('returns current year and month', () => {
    const { year, month } = getCurrentYearMonth();
    const now = new Date();
    expect(year).toBe(now.getFullYear());
    expect(month).toBe(now.getMonth());
  });

  it('formats month and year', () => {
    expect(formatMonthYear(2024, 0)).toBe('January 2024');
  });

  it('checks if date is in current month', () => {
    expect(isCurrentMonth(new Date(2024, 0, 15), 2024, 0)).toBe(true);
  });
});
