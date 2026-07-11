import express, { Request, Response } from 'express';
import { httpAuth } from '../middlewares/httpAuth';
import {
  acceptPact,
  createPact,
  deletePact,
  getPacts,
  getPendingPacts,
  rejectPact,
} from '../db/pacts';
import { getUserByUsername } from '../db/users';
import { checkIn, getCheckInForToday, getCheckIns } from '../db/checkIns';

const router = express.Router();

router.get('/', httpAuth, async (req: Request, res: Response) => {
  try {
    const pacts = await getPacts((req as any).user.id);
    const pendingPacts = await getPendingPacts((req as any).user.id);
    res.status(200).json({ pacts, pendingPacts });
  } catch (err) {
    res.status(500).json({ error: 'there was an error fetching pacts' });
  }
});

router.post('/', httpAuth, async (req: Request, res: Response) => {
  try {
    const { title, partnerUsername, durationValue, durationUnit } = req.body;
    // if (!/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
    //   throw new Error('End date must be in YYYY-MM-DD format');
    // }
    const userId = (req as any).user.id;
    const partnerId = await getUserByUsername(partnerUsername);
    if (!partnerId) throw new Error('Partner not found');

    const newPact = await createPact(
      title,
      userId,
      partnerId.id,
      durationValue,
      durationUnit,
    );
    res.status(201).json({ newPact });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete('/:id', httpAuth, async (req: Request, res: Response) => {
  try {
    const pactId = req.params.id;
    if (typeof pactId !== 'string') {
      return res.status(500).json({ error: 'server error' });
    }
    const result = await deletePact(pactId);
    res.status(204).json();
  } catch (err) {
    res.status(500).json({ error: 'server error' });
  }
});

router.patch('/:id/accept', httpAuth, async (req: Request, res: Response) => {
  try {
    const pactId = req.params.id;
    if (typeof pactId !== 'string') {
      return res.status(500).json({ error: 'server error' });
    }
    const result = await acceptPact(pactId, (req as any).user.id);
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: 'server error' });
  }
});

router.patch('/:id/reject', httpAuth, async (req: Request, res: Response) => {
  try {
    const pactId = req.params.id;
    if (typeof pactId !== 'string') {
      return res.status(500).json({ error: 'server error' });
    }
    const result = await rejectPact(pactId);
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: 'server error' });
  }
});

router.patch('/:id/checkIn', httpAuth, async (req: Request, res: Response) => {
  try {
    const pactId = req.params.id;
    if (typeof pactId !== 'string') {
      return res.status(500).json({ error: 'server error' });
    }
    const result = await checkIn(pactId, (req as any).user.id);
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: 'server error' });
  }
});

router.get('/:id/checkIn', httpAuth, async (req: Request, res: Response) => {
  try {
    const pactId = req.params.id;
    const userId = req.query.userId;
    if (typeof pactId !== 'string' || typeof userId !== 'string') {
      return res.status(500).json({ error: 'server error' });
    }
    const result = await getCheckInForToday(pactId, userId);
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: 'server error' });
  }
});

router.get('/:id/checkIns', httpAuth, async (req: Request, res: Response) => {
  try {
    const pactId = req.params.id;
    if (typeof pactId !== 'string') {
      return res.status(500).json({ error: 'server error' });
    }
    const result = await getCheckIns(pactId);
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: 'server error' });
  }
});

export default router;
