import { Router } from "express";
import ProductsModel from '../collections/products.collection';
import { upload, handleMulterError } from '../middleware/upload.middleware';
import { uploadImage, deleteImageAllVariants, sanitizeFolder, urlToKey } from '../services/s3.service';
import { listEnrichedProducts, getEnrichedProductByName } from '../services/enrichedProducts.service';

const router = Router();

const PRODUCTS_FOLDER = sanitizeFolder('products');

function parseFeatures(raw: unknown): string[] {
    if (Array.isArray(raw)) return raw.filter((x) => typeof x === 'string' && x.trim().length > 0).map((s) => s.trim())
    if (typeof raw === 'string') {
        try {
            const j = JSON.parse(raw) as unknown
            if (Array.isArray(j)) return j.filter((x) => typeof x === 'string' && x.trim().length > 0).map((s) => s.trim())
        } catch {
            /* ignore */
        }
    }
    return []
}

function parseOptionalNumber(v: unknown): number | undefined {
    if (v === undefined || v === null || v === '') return undefined
    const n = Number(v)
    return Number.isFinite(n) ? n : undefined
}

router.get('/', async (req, res) => {
    const { limit, offset, brandId, categoryId, typeId, name } = req.query;

    interface Filter {
        brandId?: string;
        categoryId?: string;
        typeId?: string;
        name?: { $regex: string, $options: string };
    }

    const filter: Filter = {};
    if (brandId) filter.brandId = brandId as string;
    if (categoryId) filter.categoryId = categoryId as string;
    if (typeId) filter.typeId = typeId as string;
    if (name) filter.name = { $regex: name as string, $options: 'i' };

    const skip = parseInt(offset as string) || 0;
    const lim = parseInt(limit as string) || 10;

    try {
        const { products, totalCount } = await listEnrichedProducts(filter, skip, lim);
        res.status(200).json({ products, totalCount });
    } catch (error) {
        console.error('Error listing products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/check/not_empty', async (_req, res) => {
    try {
        const product = await ProductsModel.findOne();
        res.status(200).json({ exists: product !== null });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const product = await getEnrichedProductByName(name);
        if (!product) {
            res.status(404).json({ message: `No records with ${name} name` });
        } else {
            res.status(200).json(product);
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.post('/', upload.array('images', 10), async (req, res) => {
    try {
        const files = (req.files as Express.Multer.File[]) ?? [];
        const imageUrls: string[] = [];

        for (const file of files) {
            const result = await uploadImage(file, PRODUCTS_FOLDER);
            imageUrls.push(result.card.url);
        }

        const listPrice = parseOptionalNumber(req.body.listPrice)
        const rating = parseOptionalNumber(req.body.rating)
        const features = parseFeatures(req.body.features)

        await ProductsModel.create({
            name: req.body.name,
            description: req.body.description,
            brandId: req.body.brandId,
            typeId: req.body.typeId,
            price: req.body.price != null ? Number(req.body.price) : undefined,
            ...(listPrice != null ? { listPrice } : {}),
            ...(rating != null && Number.isFinite(rating) ? { rating: Math.min(5, Math.max(0, rating)) } : {}),
            features,
            categoryId: req.body.categoryId,
            subcategoryId: req.body.subcategoryId,
            images: imageUrls,
        });

        res.status(201).json({ message: 'Successfully created' });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error al crear el producto' });
    }
});


router.put('/:name', upload.array('images', 10), async (req, res) => {
    try {
        const { name } = req.params;
        const product = await ProductsModel.findOne({ name }).lean().exec();

        if (!product) {
            res.status(404).json({ message: `No records with ${name} name` });
            return;
        }

        let existingImages: string[] = [];
        try {
            existingImages = JSON.parse(req.body.existingImages ?? '[]');
        } catch {
            existingImages = [];
        }

        const oldImages: string[] = product.images ?? [];
        const toDelete = oldImages.filter(url => !existingImages.includes(url));
        await Promise.all(toDelete.map(url => deleteImageAllVariants(urlToKey(url)).catch(() => {})));

        const files = (req.files as Express.Multer.File[]) ?? [];
        const newImageUrls: string[] = [];
        for (const file of files) {
            const result = await uploadImage(file, PRODUCTS_FOLDER);
            newImageUrls.push(result.card.url);
        }

        const listPrice =
            req.body.listPrice === '' || req.body.listPrice === undefined
                ? null
                : (parseOptionalNumber(req.body.listPrice) ?? null)
        const rating = parseOptionalNumber(req.body.rating)
        const features = parseFeatures(req.body.features)

        await ProductsModel.updateOne({ name }, { $set: {
            name: req.body.name,
            description: req.body.description,
            brandId: req.body.brandId,
            typeId: req.body.typeId,
            price: req.body.price != null ? Number(req.body.price) : undefined,
            listPrice: listPrice,
            ...(rating === undefined ? {} : { rating: Math.min(5, Math.max(0, rating)) }),
            features,
            categoryId: req.body.categoryId,
            subcategoryId: req.body.subcategoryId,
            images: [...existingImages, ...newImageUrls],
        }});

        res.status(202).json({ message: 'Successfully modified' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
});

router.delete('/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const product = await ProductsModel.findOne({ name }).lean().exec();

        if (!product) {
            res.status(404).json({ message: `No records with ${name} name` });
            return;
        }

        const images: string[] = product.images ?? [];
        await Promise.all(images.map(url => deleteImageAllVariants(urlToKey(url)).catch(() => {})));

        await ProductsModel.deleteOne({ name });
        res.status(202).json({ message: 'Successfully deleted' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
});

router.use(handleMulterError);

export default router;
