import { useEffect } from 'react';
import type { CalendarNavigationHandlers } from '../types/calendar';

interface UseKeyboardNavigationProps {
  navigationHandlers: CalendarNavigationHandlers;
  isEnabled?: boolean;
}

export const useKeyboardNavigation = ({
  navigationHandlers,
  isEnabled = true
}: UseKeyboardNavigationProps) => {
  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          navigationHandlers.goPrevMonth();
          break;
        case 'ArrowRight':
          event.preventDefault();
          navigationHandlers.goNextMonth();
          break;
        case 't':
        case 'T':
          event.preventDefault();
          navigationHandlers.goToday();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigationHandlers, isEnabled]);
};