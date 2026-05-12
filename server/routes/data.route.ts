import { Router } from "express";
import DataModel from '../collections/data.collection';
import { upload, handleMulterError } from '../middleware/upload.middleware';
import { uploadImage, deleteImageAllVariants, sanitizeFolder, urlToKey } from '../services/s3.service';

const router = Router();

const DATA_FOLDER = sanitizeFolder('data');

router.get('/', async (_req, res) => {
    const data = await DataModel.find({}).lean().exec();
    res.status(200).json(data);
});

router.get('/text', async (_req, res) => {
    const data = await DataModel.findOne({}, 'slogan description mision vision productsTitle productsParagraph servicesTitle servicesParagraph').lean().exec();
    res.status(200).json(data);
});

router.get('/logo', async (_req, res) => {
    const data = await DataModel.findOne({}, 'logo').lean().exec();
    res.status(200).json(data ?? null);
});

router.get('/visionImages', async (_req, res) => {
    const data = await DataModel.findOne({}, 'visionImages').lean().exec();
    res.status(200).json(data ?? null);
});

router.get('/presentationImages', async (_req, res) => {
    const data = await DataModel.findOne({}, 'presentationImages').lean().exec();
    res.status(200).json(data ?? null);
});

router.put('/main-page', upload.single('logo'), async (req, res) => {
    try {
        const existing = await DataModel.findOne({}, 'logo').lean().exec();
        const updateFields: Record<string, unknown> = {
            slogan: req.body.slogan,
            description: req.body.description,
            mision: req.body.mision,
            vision: req.body.vision,
        };

        if (req.body.removeLogo === 'true') {
            if (existing?.logo) await deleteImageAllVariants(urlToKey(existing.logo)).catch(() => {});
            updateFields.logo = null;
        } else if (req.file) {
            if (existing?.logo) await deleteImageAllVariants(urlToKey(existing.logo)).catch(() => {});
            const result = await uploadImage(req.file, DATA_FOLDER);
            updateFields.logo = result.card.url;
        }

        const data = await DataModel.findOneAndUpdate({}, { $set: updateFields }, { new: true });
        if (!data) { res.status(404).json({ message: 'No records found' }); return; }
        res.status(202).json({ message: 'Successfully modified', data });
    } catch (error) {
        console.error('Error updating main-page:', error);
        res.status(500).json({ message: 'Error al actualizar la página principal' });
    }
});

// existingImages: JSON array de URLs a conservar
// images: archivos nuevos
router.put('/vision-images', upload.array('images', 10), async (req, res) => {
    try {
        const existing = await DataModel.findOne({}, 'visionImages').lean().exec();

        let existingImages: string[] = [];
        try {
            existingImages = JSON.parse(req.body.existingImages ?? '[]');
        } catch {
            existingImages = [];
        }

        if (existing) {
            const oldImages: string[] = (existing.visionImages as string[]) ?? [];
            const toDelete = oldImages.filter(url => !existingImages.includes(url));
            await Promise.all(toDelete.map(url => deleteImageAllVariants(urlToKey(url)).catch(() => {})));
        }

        const files = (req.files as Express.Multer.File[]) ?? [];
        const newImageUrls: string[] = [];
        for (const file of files) {
            const result = await uploadImage(file, DATA_FOLDER);
            newImageUrls.push(result.card.url);
        }

        const data = await DataModel.findOneAndUpdate({}, { $set: {
            visionImages: [...existingImages, ...newImageUrls],
        }}, { new: true });

        if (!data) { res.status(404).json({ message: 'No records found' }); return; }
        res.status(202).json({ message: 'Successfully modified', data });
    } catch (error) {
        console.error('Error updating vision-images:', error);
        res.status(500).json({ message: 'Error al actualizar las imágenes de visión' });
    }
});

// existingImages: JSON array de URLs a conservar
// images: archivos nuevos
router.put('/presentation-images', upload.array('images', 10), async (req, res) => {
    try {
        const existing = await DataModel.findOne({}, 'presentationImages').lean().exec();

        let existingImages: string[] = [];
        try {
            existingImages = JSON.parse(req.body.existingImages ?? '[]');
        } catch {
            existingImages = [];
        }

        if (existing) {
            const oldImages: string[] = (existing.presentationImages as string[]) ?? [];
            const toDelete = oldImages.filter(url => !existingImages.includes(url));
            await Promise.all(toDelete.map(url => deleteImageAllVariants(urlToKey(url)).catch(() => {})));
        }

        const files = (req.files as Express.Multer.File[]) ?? [];
        const newImageUrls: string[] = [];
        for (const file of files) {
            const result = await uploadImage(file, DATA_FOLDER);
            newImageUrls.push(result.card.url);
        }

        const data = await DataModel.findOneAndUpdate({}, { $set: {
            presentationImages: [...existingImages, ...newImageUrls],
        }}, { new: true });

        if (!data) { res.status(404).json({ message: 'No records found' }); return; }
        res.status(202).json({ message: 'Successfully modified', data });
    } catch (error) {
        console.error('Error updating presentation-images:', error);
        res.status(500).json({ message: 'Error al actualizar las imágenes de presentación' });
    }
});

router.put('/products-services', async (req, res) => {
    const data = await DataModel.findOneAndUpdate({}, { $set: {
        productsTitle: req.body.productsTitle,
        productsParagraph: req.body.productsParagraph,
        servicesTitle: req.body.servicesTitle,
        servicesParagraph: req.body.servicesParagraph,
    }}, { new: true });
    if (!data) { return res.status(404).json({ message: 'No records found' }); }
    return res.status(202).json({ message: 'Successfully modified', data });
});

router.use(handleMulterError);

export default router;
