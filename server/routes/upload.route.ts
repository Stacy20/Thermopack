import { Router, Request, Response } from 'express';
import { upload, handleMulterError } from '../middleware/upload.middleware.js';
import { uploadImage, deleteImage, deleteImageAllVariants, sanitizeFolder } from '../services/s3.service.js';

const router = Router();

router.post('/image', upload.single('image'), async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ message: 'No se recibió ningún archivo' });
    return;
  }
  try {
    const folder = sanitizeFolder(req.query.folder);
    const result = await uploadImage(req.file, folder);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({ message: 'Error al procesar la imagen' });
  }
});

router.post('/images', upload.array('images', 10), async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files?.length) {
    res.status(400).json({ message: 'No se recibieron archivos' });
    return;
  }
  try {
    const folder = sanitizeFolder(req.query.folder);
    const results = [];
    for (const file of files) {
      results.push(await uploadImage(file, folder));
    }
    res.status(201).json(results);
  } catch (error) {
    console.error('Error al subir imágenes:', error);
    res.status(500).json({ message: 'Error al procesar las imágenes' });
  }
});

router.delete('/image', async (req: Request, res: Response) => {
  const { key } = req.body as { key?: string };
  if (!key) {
    res.status(400).json({ message: 'El campo key es requerido' });
    return;
  }
  try {
    await deleteImage(key);
    res.status(200).json({ message: 'Imagen eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    res.status(500).json({ message: 'Error al eliminar la imagen' });
  }
});

/** Deletes all variants (thumb / card / zoom) given any one variant key. */
router.delete('/image/variants', async (req: Request, res: Response) => {
  const { key } = req.body as { key?: string };
  if (!key) {
    res.status(400).json({ message: 'El campo key es requerido' });
    return;
  }
  try {
    await deleteImageAllVariants(key);
    res.status(200).json({ message: 'Variantes eliminadas correctamente' });
  } catch (error) {
    console.error('Error al eliminar variantes:', error);
    res.status(500).json({ message: 'Error al eliminar las variantes' });
  }
});

router.use(handleMulterError);

export default router;
