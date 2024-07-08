import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Format date to time from now
 * @example
 * timeFromNow(new Date()) // a few seconds ago
 * timeFromNow(new Date('2021-01-01')) // 9 months ago
 */
export const timeFromNow = (date: string | number | Date) => {
  return formatDistanceToNow(date, { locale: vi, addSuffix: true });
};
