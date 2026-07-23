import express, { Request, Response } from 'express';
import { httpAuth } from '../middlewares/httpAuth';
import { getAvatarUploadUrl } from '../s3';

const router = express.Router();

router.post('/avatar', httpAuth, async (req: Request, res: Response) => {
  const { contentType } = req.body;
  const result = await getAvatarUploadUrl((req as any).user.id, contentType);
  res.status(200).json({ result });
});

export default router;
