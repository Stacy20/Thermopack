import { Router } from "express";
import ServicesModel from '../collections/services.collection';

const router = Router();

// Obtiene todos los servicios
router.get('/', async (req, res) => {
    const allServices = await ServicesModel.find({}).lean().exec();
    res.status(200).json(allServices);
});

// Obtiene un servicio por su nombre
router.get('/:name', async (req, res) => {
    const { name } = req.params;
    const serviceWithName = await ServicesModel.find({ name }).lean().exec();

    if (serviceWithName.length === 0) {
        res.status(404).json({ message: `No records with ${name} name` });
    } else {
        res.status(200).json(serviceWithName[0]);
    }
});

// Crea un nuevo servicio
router.post('/', async (req, res) => {
    const service = await ServicesModel.create({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        images: req.body.images,
    });
    res.status(201).json(service);
});

// Modifica un servicio por su nombre
router.put('/:name', async (req, res) => {
    const { name } = req.params;
    const serviceWithName = await ServicesModel.find({ name }).lean().exec();

    if (serviceWithName.length === 0) {
        res.status(404).json({ message: `No records with ${name} name` });
        return;
    } 
    await ServicesModel.updateOne({ name: req.params.name }, { $set: {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      images: req.body.images,
    } });
    res.status(202).json({ message: 'Successfully modified' });
});

// Elimina un servicio por su nombre
router.delete('/:name', async (req, res) => {
    const { name } = req.params;
    const serviceWithName = await ServicesModel.find({ name }).lean().exec();

    if (serviceWithName.length === 0) {
        res.status(404).json({ message: `No records with ${name} name` });
        return;
    } 
    await ServicesModel.deleteOne({ name: req.params.name });
    res.status(202).json({ message: 'Successfully deleted' });
});

export default router;
