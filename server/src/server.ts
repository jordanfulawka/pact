import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import pactRouter from './routes/pacts';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/pacts', pactRouter);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

io.on('connection', (socket) => {
  console.log('hiii')!;
});

export default httpServer;
