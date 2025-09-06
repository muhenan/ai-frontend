import { describe, expect, it } from 'vitest';
import { dateKeyToDate, dateToDateKey, formatDateForDisplay } from './dateHelpers';

describe('dateHelpers', () => {
  it('converts date to date key and back', () => {
    const date = new Date('2024-01-02');
    const key = dateToDateKey(date);
    expect(key).toBe('2024-01-02');
    const parsed = dateKeyToDate(key);
    expect(parsed.toISOString().slice(0, 10)).toBe('2024-01-02');
  });

  it('formats date for display', () => {
    const display = formatDateForDisplay('2024-01-02');
    expect(display).toContain('2024-01-02');
  });
});
