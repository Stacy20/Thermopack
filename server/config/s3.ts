import { S3Client } from '@aws-sdk/client-s3';


export const awsRegion = process.env.AWS_REGION ?? 'us-east-1';
export const S3_BUCKET = process.env.S3_BUCKET ?? '';
export const S3_PUBLIC_BASE_URL = (process.env.S3_PUBLIC_BASE_URL ?? '').replace(/\/$/, '');
export const S3_KEY_PREFIX = (process.env.S3_KEY_PREFIX ?? '').replace(/\/$/, '');
export const s3Client = new S3Client({ region: awsRegion });
