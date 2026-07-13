import cron from 'node-cron';
import type { Server } from 'socket.io';
import { checkStreaks } from './checkStreaks';

export function startScheduler(io: Server) {
  return cron.schedule('0 0 * * *', () => checkStreaks(io), {
    timezone: 'America/New_York',
  });
}
