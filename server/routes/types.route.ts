import { Router } from "express";
import TypesModel from '../collections/types.collection';

const router = Router();

// Obtiene todos los tipos
router.get('/', async (req, res) => {
    const allTypes = await TypesModel.find({}).lean().exec();
    res.status(200).json(allTypes);
});

// Obtiene un tipo por su nombre
router.get('/:name', async (req, res) => {
    const { name } = req.params;
    const typeWithName = await TypesModel.find({ name }).lean().exec();

    if (typeWithName.length === 0) {
        res.status(404).json({ message: `No records with ${name} name` });
    } else {
        res.status(200).json(typeWithName[0]);
    }
});

// Crea un nuevo tipo
router.post('/', async (req, res) => {
    const type = await TypesModel.create({
        name: req.body.name,
    });
    res.status(201).json(type);
});

// Modifica un tipo por su nombre
router.put('/:name', async (req, res) => {
    const { name } = req.params;
    const typeWithName = await TypesModel.find({ name }).lean().exec();
    if (typeWithName.length === 0) {
        res.status(404).json({ message: `No records with ${name} name` });
        return;
    }
    await TypesModel.updateOne({ name: req.params.name }, { $set: { name: req.body.name } });
    res.status(202).json({ message: 'Successfully modified' });
});

// Elimina un tipo por su nombre
router.delete('/:name', async (req, res) => {
    const { name } = req.params;
    const typeWithName = await TypesModel.find({ name }).lean().exec();
    if (typeWithName.length === 0) {
        res.status(404).json({ message: `No records with ${name} name` });
        return;
    }
    await TypesModel.deleteOne({ name: req.params.name });
    res.status(202).json({ message: 'Successfully deleted' });
});

export default router;
