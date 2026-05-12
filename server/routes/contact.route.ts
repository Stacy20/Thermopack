import { Router } from "express";
import ContactModel from '../collections/contact.collection';
import { upload, handleMulterError } from '../middleware/upload.middleware';
import { uploadImage, deleteImageAllVariants, sanitizeFolder, urlToKey } from '../services/s3.service';

const router = Router();

const CONTACT_FOLDER = sanitizeFolder('contact');

router.get('/', async (_req, res) => {
    const contactData = await ContactModel.findOne({}).lean().exec();
    res.status(200).json(contactData ?? null);
});

router.put('/', upload.array('images', 10), async (req, res) => {
    try {
        const existing = await ContactModel.findOne({}).lean().exec();
        const files = (req.files as Express.Multer.File[]) ?? [];
        const hasImageUpdate = req.body.existingImages !== undefined || files.length > 0;

        let existingImages: string[] = [];
        try {
            existingImages = JSON.parse(req.body.existingImages ?? '[]');
        } catch {
            existingImages = [];
        }

        if (hasImageUpdate && existing) {
            const oldImages: string[] = existing.images ?? [];
            const toDelete = oldImages.filter(url => !existingImages.includes(url));
            await Promise.all(toDelete.map(url => deleteImageAllVariants(urlToKey(url)).catch(() => {})));
        }

        const newImageUrls: string[] = [];
        for (const file of files) {
            const result = await uploadImage(file, CONTACT_FOLDER);
            newImageUrls.push(result.card.url);
        }

        const updateFields: Record<string, unknown> = {
            welcomeParagraph: req.body.welcomeParagraph,
            ubicationText: req.body.ubicationText,
            ubicationGMLink: req.body.ubicationGMLink,
            ubicationWazeLink: req.body.ubicationWazeLink,
            telephoneNumbers: req.body.telephoneNumbers,
            email: req.body.email,
            whatsappLink: req.body.whatsappLink,
            facebookLink: req.body.facebookLink,
            instagramLink: req.body.instagramLink,
            youtubeLink: req.body.youtubeLink,
        };
        if (hasImageUpdate) {
            updateFields.images = [...existingImages, ...newImageUrls];
        }

        const contactData = await ContactModel.findOneAndUpdate({}, { $set: updateFields }, { new: true });
        if (!contactData) { res.status(404).json({ message: 'No records found' }); return; }
        res.status(202).json({ message: 'Successfully modified', contactData });
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ message: 'Error al actualizar el contacto' });
    }
});

router.use(handleMulterError);

export default router;
