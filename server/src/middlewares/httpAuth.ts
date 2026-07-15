import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

function httpAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'No JWT secret' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    (req as any).user = decoded;
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}

export { httpAuth };
