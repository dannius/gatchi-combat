import { DAY_MS } from './day-ms';

export function dailyRepeat(hourse, minutes, callback: () => void) {
  const now = new Date();
  const repeatTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hourse, minutes, 0, 0);

  let millisTillTime = repeatTime.getTime() - now.getTime();

  if (millisTillTime < 0) {
    millisTillTime += DAY_MS;
  }

  setTimeout(() => {
    callback();
    dailyRepeat(hourse, minutes, callback);
  }, millisTillTime);
}
