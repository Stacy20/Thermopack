import { Router } from "express";
import CategoryModel from '../collections/categories.collection';

const router = Router();

// Obtiene todas las categorías
router.get('/', async (req, res) => {
    const allCategories = await CategoryModel.find({}).lean().exec();
    res.status(200).json(allCategories);
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
    await CategoryModel.updateOne({ name: req.params.name }, { $set: { name: req.body.name } });
    res.status(202).json({ message: 'Successfully modified' });
});

// Elimina una categoría por su nombre
router.delete('/:name', async (req, res) => {
    await CategoryModel.deleteOne({ name: req.params.name });
    res.status(202).json({ message: 'Successfully deleted' });
});

export default router;
