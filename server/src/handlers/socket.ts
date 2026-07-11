import type { Socket, Server } from 'socket.io';
import { getPacts, getPendingPacts } from '../db/pacts';

function registerHandlers(io: Server) {
  io.on('connection', async (socket: Socket) => {
    const userId = socket.data.user.id;

    const pactIds = (await getPacts(userId)).map((pact) => pact.id);
    const pendingPactIds = (await getPendingPacts(userId)).map(
      (pact) => pact.id,
    );
    const allIds = pactIds.concat(pendingPactIds);

    allIds.forEach((id) => socket.join(`pact:${id}`));
    socket.join(userId);

    socket.on('pact_created', ({ partnerId, pactId }) => {
      socket.join(`pact:${pactId}`);
      io.in(partnerId).socketsJoin(`pact:${pactId}`);
      io.to(partnerId).emit('pact_created');
    });
    socket.on('pact_accepted', (pactId) => {
      socket.join(`pact:${pactId}`);
      io.to(`pact:${pactId}`).emit('pact_accepted');
    });
    socket.on('pact_rejected', (pactId) => {
      socket.join(`pact:${pactId}`);
      io.to(`pact:${pactId}`).emit('pact_rejected');
    });
    socket.on('pact_checkin', (pactId) => {
      io.to(`pact:${pactId}`).emit('pact_checkin');
    });
    socket.on('pact_delete', (pactId) => {
      io.to(`pact:${pactId}`).emit('pact_delete');
    });
  });
}

export { registerHandlers };
