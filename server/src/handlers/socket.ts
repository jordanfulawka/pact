import type { Socket, Server } from 'socket.io';

function registerHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    const userId = socket.data.user.id;
    socket.join(userId);
    socket.on('refresh_pacts', (partnerId) => {
      console.log('new pact was created for you');
      io.to(partnerId).emit('refresh_pacts');
    });
  });
}

export { registerHandlers };
