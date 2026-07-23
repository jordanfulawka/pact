import dotenv from 'dotenv';
dotenv.config();
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const region = process.env.AWS_REGION;
const Bucket = process.env.AWS_S3_BUCKET_NAME;

if (!accessKeyId || !secretAccessKey || !region || !Bucket) {
  throw new Error('Missing required AWS environment variables');
}

const s3 = new S3Client({
  region,
  credentials: { accessKeyId, secretAccessKey },
});

async function getAvatarUploadUrl(userId: string, contentType: string) {
  const key = `${userId}/${randomUUID()}`;
  const command = new PutObjectCommand({
    Bucket,
    Key: key,
    ContentType: contentType,
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 60 });
  return { url, key };
}

export { getAvatarUploadUrl };
