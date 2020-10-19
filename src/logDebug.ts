import { DEBUG } from './constants';

export function logDebug(...message: any[]) {
  if (DEBUG) console.log(message);
}
