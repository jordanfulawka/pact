import express, { Request, Response } from 'express';
import { httpAuth } from '../middlewares/httpAuth';
import { createPact } from '../db/pacts';
import { getUserByUsername } from '../db/users';

const router = express.Router();

router.post('/', httpAuth, async (req: Request, res: Response) => {
  try {
    const { title, partnerUsername, endDate } = req.body;
    if (!endDate) throw new Error('End date is required');
    const parsedEndDate = new Date(endDate).toISOString();
    const userId = (req as any).user.id;
    const partnerId = await getUserByUsername(partnerUsername);
    if (!partnerId) throw new Error('Partner not found');

    const newPact = await createPact(
      title,
      userId,
      partnerId.id,
      parsedEndDate,
    );
    res.status(201).json({ newPact });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export default router;
