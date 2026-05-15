import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { randomUUID } from 'crypto';
import { unlink, open } from 'fs/promises';
import { s3Client, S3_BUCKET, S3_PUBLIC_BASE_URL, S3_KEY_PREFIX, awsRegion } from '../config/s3.js';

sharp.cache(false);
sharp.concurrency(2);

const SHARP_OPTS: sharp.SharpOptions = { limitInputPixels: 50_000_000 };

// ── Magic bytes ───────────────────────────────────────────────────────────────

type MagicBytesChecker = (header: Buffer) => boolean;

const MAGIC_BYTES_BY_MIME: Record<string, MagicBytesChecker> = {
  'image/jpeg': (header) => header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff,
  'image/png':  (header) => header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47,
  'image/webp': (header) => header[8] === 0x57 && header[9] === 0x45 && header[10] === 0x42 && header[11] === 0x50,
  'image/gif':  (header) => header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46,
  'image/avif': (header) => {
    // ISO BMFF: bytes 4–7 must be "ftyp"; major brand at 8–11
    if (header[4] !== 0x66 || header[5] !== 0x74 || header[6] !== 0x79 || header[7] !== 0x70) return false;
    const majorBrand = header.subarray(8, 12).toString('ascii');
    return majorBrand === 'avif' || majorBrand === 'avis' || majorBrand === 'mif1';
  },
};

/** Reads the first 16 bytes of a file and checks them against known magic bytes. */
async function validateMagicBytes(filePath: string, mimetype: string): Promise<void> {
  const fileHandle = await open(filePath, 'r');
  try {
    const headerBytes = Buffer.alloc(16);
    await fileHandle.read(headerBytes, 0, 16, 0);
    const isValidFile = MAGIC_BYTES_BY_MIME[mimetype]?.(headerBytes);
    if (!isValidFile) {
      throw new Error(`El contenido del archivo no coincide con el tipo declarado (${mimetype})`);
    }
  } finally {
    await fileHandle.close();
  }
}

// ── Folder ────────────────────────────────────────────────────────────────────

const SAFE_FOLDER_RE = /^[a-zA-Z0-9_-]{1,64}$/;

/** Ensures the folder path segment is safe to use as an S3 key prefix. */
export function sanitizeFolder(raw: unknown): string {
  const value = typeof raw === 'string' ? raw.trim() : '';
  return SAFE_FOLDER_RE.test(value) ? value : 'images';
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ImageVariantResult {
  key: string;
  url: string;
}

export interface UploadImageResult {
  card: ImageVariantResult;
}

interface VariantSpec {
  name: 'card';
  width: number;
  quality: number;
}

const CARD_VARIANT: VariantSpec = { name: 'card', width: 600, quality: 82 };

// ── Upload ────────────────────────────────────────────────────────────────────

/**
 * Validates, resizes, and uploads a single WebP (600px “card”) to S3.
 * The temporary file is deleted regardless of the outcome.
 */
export async function uploadImage(
  file: Express.Multer.File,
  folder: string
): Promise<UploadImageResult> {
  await validateMagicBytes(file.path, file.mimetype);

  try {
    const sourceBuffer = await sharp(file.path, SHARP_OPTS).rotate().toBuffer();

    const prefix = S3_KEY_PREFIX ? `${S3_KEY_PREFIX}/` : '';
    const uuid   = randomUUID();
    const spec   = CARD_VARIANT;

    const buffer = await sharp(sourceBuffer, SHARP_OPTS)
      .resize({ width: spec.width, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: spec.quality, effort: 4 })
      .toBuffer();

    const key = `${prefix}${folder}/${uuid}-${spec.name}.webp`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: 'image/webp',
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );

    return { card: { key, url: getImageUrl(key) } };
  } finally {
    await unlink(file.path).catch(() => {});
  }
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deleteImage(key: string): Promise<void> {
  await s3Client.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: key }));
}

/** Deletes thumb / card / zoom keys derived from any one variant URL key (nuevas subidas solo crean `card`). */
export async function deleteImageAllVariants(anyVariantKey: string): Promise<void> {
  const base     = anyVariantKey.replace(/-(thumb|card|zoom)\.webp$/, '');
  const suffixes = ['thumb', 'card', 'zoom'] as const;
  await Promise.all(suffixes.map((suffix) => deleteImage(`${base}-${suffix}.webp`).catch(() => {})));
}

// ── URL ───────────────────────────────────────────────────────────────────────

export function getImageUrl(key: string): string {
  if (S3_PUBLIC_BASE_URL) return `${S3_PUBLIC_BASE_URL}/${key}`;
  return `https://${S3_BUCKET}.s3.${awsRegion}.amazonaws.com/${key}`;
}

/** Extrae la S3 key de una URL pública generada por getImageUrl. */
export function urlToKey(url: string): string {
  if (S3_PUBLIC_BASE_URL && url.startsWith(`${S3_PUBLIC_BASE_URL}/`)) {
    return url.slice(S3_PUBLIC_BASE_URL.length + 1);
  }
  const match = url.match(/amazonaws\.com\/(.+)$/);
  return match ? match[1] : url;
}
