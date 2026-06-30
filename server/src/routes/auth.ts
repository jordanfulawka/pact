import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import { createUser, getUserByEmail } from '../db/users';

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    console.log('hello!');
    const { name, username, email, password } = req.body;
    const password_hash = await bcrypt.hash(password, 12);
    const newUser = await createUser(name, username, email, password_hash);

    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ error: 'Server misconfiguration: missing JWT secret' });
    }

    const token = jwt.sign(
      {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
      },
      process.env.JWT_SECRET,
    );

    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ error: 'Could not complete registration' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'Email not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ error: 'Server misconfiguration: missing JWT secret' });
    }

    if (passwordMatch) {
      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
        },
        process.env.JWT_SECRET,
      );
      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: 'Passowrd incorrect' });
    }
  } catch (err) {
    res.status(400).json({ error: 'Could not complete login' });
  }
});

export default router;
