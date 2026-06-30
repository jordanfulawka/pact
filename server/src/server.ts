import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import pactRouter from './routes/pacts';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/pacts', pactRouter);

export default app;
