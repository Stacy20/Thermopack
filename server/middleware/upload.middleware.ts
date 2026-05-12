import multer, { MulterError } from 'multer';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';
import type { Request, Response, NextFunction } from 'express';

export const MAX_FILE_SIZE_MB = 25;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// Extension is derived from the validated MIME type, never from the original filename
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png':  'png',
  'image/webp': 'webp',
  'image/gif':  'gif',
  'image/avif': 'avif',
};

// Storage configuration
const storage = multer.diskStorage({
  destination: tmpdir(),
  filename: (_request, file, callback) => {
    const fileExtension = MIME_TO_EXT[file.mimetype] ?? 'bin';
    callback(null, `upload-${randomUUID()}.${fileExtension}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: 10 },
  fileFilter: (_request, file, callback) => {
    if (file.mimetype in MIME_TO_EXT) {
      callback(null, true);
    } else {
      callback(new Error(`Tipo de archivo no soportado: ${file.mimetype}`));
    }
  },
});

/** Captures Multer and file-type errors before they reach the global error handler. */
export function handleMulterError(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        res.status(413).json({ message: `El archivo supera el límite de ${MAX_FILE_SIZE_MB}MB` });
        return;
      case 'LIMIT_FILE_COUNT':
        res.status(400).json({ message: 'Se superó el número máximo de archivos permitidos (10)' });
        return;
      case 'LIMIT_UNEXPECTED_FILE':
        res.status(400).json({ message: `Campo de archivo inesperado: ${err.field}` });
        return;
      default:
        res.status(400).json({ message: `Error de carga: ${err.message}` });
        return;
    }
  }

  if (err instanceof Error && err.message.startsWith('Tipo de archivo')) {
    res.status(415).json({ message: err.message });
    return;
  }

  next(err);
}
