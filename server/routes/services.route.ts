import { Router } from "express";
import ServicesModel from '../collections/services.collection';

const router = Router();

router.get('/', async (req, res) => {
    const { limit, offset } = req.query;
    const limitValue: number = limit ? parseInt(limit.toString()) : 10;
    const offsetValue: number = offset ? parseInt(offset.toString()) : 0;

    try {
        // Consulta para obtener la lista de servicios paginada
        const services = await ServicesModel.find({})
            .skip(offsetValue)
            .limit(limitValue)
            .lean()
            .exec();

        // Consulta para obtener el número total de servicios
        const totalCount = await ServicesModel.countDocuments();

        // Enviar la respuesta con la lista de servicios y el total de servicios
        res.status(200).json({
            services: services,
            totalCount: totalCount
        });
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor" });
    }
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
