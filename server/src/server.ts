import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import pactRouter from './routes/pacts';
import presignRouter from './routes/presign';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { socketAuth } from './middlewares/socketAuth';
import { registerHandlers } from './handlers/socket';
import { startScheduler } from './jobs/scheduler';
import type {
  Request,
  Response,
  ErrorRequestHandler,
  NextFunction,
} from 'express';

const app = express();

const clientOrigin = process.env.CLIENT_ORIGIN;
if (!clientOrigin) {
  throw new Error('CLIENT_ORIGIN environment variable is required');
}

app.use(cors({ origin: clientOrigin }));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/pacts', pactRouter);
app.use('/api/presign', presignRouter);
// app.all('*', (req, res, next) => {

//   const err = new Error(`Can't find ${req.originalUrl} on the server`);
//   err.status = 'fail';
//   err.statusCode = 404;
//   next(err);
// });

// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';
//   res.status(err.statusCode).json({
//     status: err.statusCode,
//     message: err.message,
//   });
// });

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: clientOrigin,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

io.use(socketAuth);
registerHandlers(io);
startScheduler(io);

export default httpServer;
