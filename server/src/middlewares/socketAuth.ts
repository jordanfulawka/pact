import type { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

function socketAuth(socket: Socket, next: (err?: Error) => void) {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('No token provided'));
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next(new Error('No JWT secret provided'));
  }

  try {
    const decoded = jwt.verify(token, secret);
    socket.data.user = decoded;
  } catch (err) {
    return next(new Error('Invalid token'));
  }

  next();
}

export { socketAuth };
