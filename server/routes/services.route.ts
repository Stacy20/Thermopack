import { Router } from "express";
import ServicesModel from '../collections/services.collection';
import { upload, handleMulterError } from '../middleware/upload.middleware';
import { uploadImage, deleteImageAllVariants, sanitizeFolder, urlToKey } from '../services/s3.service';

const router = Router();

const SERVICES_FOLDER = sanitizeFolder('services');

router.get('/', async (req, res) => {
    const { limit, offset } = req.query;
    const limitValue = limit ? parseInt(limit.toString()) : 10;
    const offsetValue = offset ? parseInt(offset.toString()) : 0;

    try {
        const services = await ServicesModel.find({}).skip(offsetValue).limit(limitValue).lean().exec();
        const totalCount = await ServicesModel.countDocuments();
        res.status(200).json({ services, totalCount });
    } catch {
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

router.get('/check/not_empty', async (_req, res) => {
    try {
        const service = await ServicesModel.findOne();
        res.status(200).json({ exists: service !== null });
    } catch (error) {
        console.error('Error fetching service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:name', async (req, res) => {
    const { name } = req.params;
    const service = await ServicesModel.findOne({ name }).lean().exec();
    if (!service) {
        res.status(404).json({ message: `No records with ${name} name` });
    } else {
        res.status(200).json(service);
    }
});

router.post('/', upload.array('images', 10), async (req, res) => {
    try {
        const files = (req.files as Express.Multer.File[]) ?? [];
        const imageUrls: string[] = [];

        for (const file of files) {
            const result = await uploadImage(file, SERVICES_FOLDER);
            imageUrls.push(result.card.url);
        }

        const service = await ServicesModel.create({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price != null ? Number(req.body.price) : undefined,
            images: imageUrls,
        });

        res.status(201).json(service);
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ message: 'Error al crear el servicio' });
    }
});


router.put('/:name', upload.array('images', 10), async (req, res) => {
    try {
        const { name } = req.params;
        const service = await ServicesModel.findOne({ name }).lean().exec();

        if (!service) {
            res.status(404).json({ message: `No records with ${name} name` });
            return;
        }

        let existingImages: string[] = [];
        try {
            existingImages = JSON.parse(req.body.existingImages ?? '[]');
        } catch {
            existingImages = [];
        }

        const oldImages: string[] = service.images ?? [];
        const toDelete = oldImages.filter(url => !existingImages.includes(url));
        await Promise.all(toDelete.map(url => deleteImageAllVariants(urlToKey(url)).catch(() => {})));

        const files = (req.files as Express.Multer.File[]) ?? [];
        const newImageUrls: string[] = [];
        for (const file of files) {
            const result = await uploadImage(file, SERVICES_FOLDER);
            newImageUrls.push(result.card.url);
        }

        await ServicesModel.updateOne({ name }, { $set: {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price != null ? Number(req.body.price) : undefined,
            images: [...existingImages, ...newImageUrls],
        }});

        res.status(202).json({ message: 'Successfully modified' });
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ message: 'Error al actualizar el servicio' });
    }
});

router.delete('/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const service = await ServicesModel.findOne({ name }).lean().exec();

        if (!service) {
            res.status(404).json({ message: `No records with ${name} name` });
            return;
        }

        const images: string[] = service.images ?? [];
        await Promise.all(images.map(url => deleteImageAllVariants(urlToKey(url)).catch(() => {})));

        await ServicesModel.deleteOne({ name });
        res.status(202).json({ message: 'Successfully deleted' });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ message: 'Error al eliminar el servicio' });
    }
});

router.use(handleMulterError);

export default router;
