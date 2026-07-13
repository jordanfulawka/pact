import type { Server } from 'socket.io';
import { resetBrokenStreaks } from '../db/streaks';

export async function checkStreaks(io: Server) {
  const resetPactIds = await resetBrokenStreaks();
  resetPactIds.forEach((pactId) =>
    io.to(`pact:${pactId}`).emit('streak_reset'),
  );
}
