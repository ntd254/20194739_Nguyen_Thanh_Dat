/**
 * Convert second to hour, minute, second
 * @example
 * convertSecondToHour(3661) // { hours: 1, minutes: 1, seconds: 1 }
 * convertSecondToHour(3600) // { hours: 1 }
 * convertSecondToHour(60) // { minutes: 1 }
 * convertSecondToHour(1) // { seconds: 1 }
 * convertSecondToHour(0) // {}
 */
export function convertSecondToHour(second: number) {
  const hours = Math.floor(second / 3600);
  const minutes = Math.floor((second % 3600) / 60);
  const seconds = second % 60;

  const result = {
    hours: hours > 0 ? hours : undefined,
    minutes: minutes > 0 ? minutes : undefined,
    seconds: seconds > 0 ? seconds : undefined,
  };

  return result;
}
