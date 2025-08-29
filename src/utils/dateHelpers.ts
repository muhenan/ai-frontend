import { format } from 'date-fns';
import type { DateKey } from '../types/notes';

export function dateToDateKey(date: Date): DateKey {
  return format(date, 'yyyy-MM-dd');
}

export function dateKeyToDate(dateKey: DateKey): Date {
  return new Date(dateKey);
}

export function formatDateForDisplay(dateKey: DateKey): string {
  const date = dateKeyToDate(dateKey);
  return format(date, 'EEE, yyyy-MM-dd');
}

export function formatTimeForDisplay(isoString: string): string {
  const date = new Date(isoString);
  return format(date, 'HH:mm');
}

export function formatDateTimeForDisplay(isoString: string): string {
  const date = new Date(isoString);
  return format(date, 'HH:mm / yyyy-MM-dd');
}