import { Router } from "express";
import CategoryModel from '../collections/categories.collection';
import ProductsModel from '../collections/products.collection';

const router = Router();

// Obtiene todas las categorías con conteo de productos
router.get('/', async (req, res) => {
    const allCategories = await CategoryModel.find({}).lean().exec();
    const counts = await ProductsModel.aggregate([
        { $group: { _id: '$categoryId', count: { $sum: 1 } } }
    ]);
    const countMap: Record<string, number> = Object.fromEntries(
        counts.map((c: { _id: string; count: number }) => [String(c._id), c.count])
    );
    const result = allCategories.map((cat) => ({
        ...cat,
        productCount: countMap[String(cat._id)] ?? 0,
    }));
    res.status(200).json(result);
});

// Obtiene una categoría por su nombre
router.get('/:name', async (req, res) => {
    const { name } = req.params;
    const categoryWithName = await CategoryModel.find({ name }).lean().exec();

    if (categoryWithName.length === 0) {
        res.status(404).json({ message: `No records with ${name} name` });
    } else {
        res.status(200).json(categoryWithName[0]);
    }
});

// Crea una nueva categoría
router.post('/', async (req, res) => {
    const category = await CategoryModel.create({
        name: req.body.name,
    });
    res.status(201).json(category);
});

// Modifica una categoría por su nombre
router.put('/:name', async (req, res) => {
    const { name } = req.params;
    const categoryWithName = await CategoryModel.find({ name }).lean().exec();
    if (categoryWithName.length === 0) {
        res.status(404).json({ message: `No records with ${name} name` });
        return;
    }
    await CategoryModel.updateOne({ name: req.params.name }, { $set: { name: req.body.name } });
    res.status(202).json({ message: 'Successfully modified' });
});

// Elimina una categoría por su nombre
router.delete('/:name', async (req, res) => {
    const { name } = req.params;
    const categoryWithName = await CategoryModel.find({ name }).lean().exec();
    if (categoryWithName.length === 0) {
        res.status(404).json({ message: `No records with ${name} name` });
        return;
    }
    await CategoryModel.deleteOne({ name: req.params.name });
    res.status(202).json({ message: 'Successfully deleted' });
});

export default router;
