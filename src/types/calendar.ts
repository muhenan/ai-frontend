export interface CalendarState {
  currentYear: number;
  currentMonth: number; // 0-11
}

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export type CalendarMatrix = CalendarDay[][];

export interface CalendarNavigationHandlers {
  goPrevMonth: () => void;
  goNextMonth: () => void;
  goToday: () => void;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
}