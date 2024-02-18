import { Router } from "express";
import BrandModel from '../collections/brands.collection';

const router = Router();

// Obtiene todas las marcas
router.get('/', async (req, res) => {
    const allBrands = await BrandModel.find({}).lean().exec();
    res.status(200).json(allBrands);
});

// Obtiene una marca por su nombre
router.get('/:name', async (req, res) => {
    const { name } = req.params;
    const brandWithName = await BrandModel.find({ name }).lean().exec();

    if (brandWithName.length === 0) {
        res.status(404).json({ message: `No records with ${name} name` });
    } else {
        res.status(200).json(brandWithName[0]);
    }
});

// Crea una nueva marca
router.post('/', async (req, res) => {
  const brand = await BrandModel.create({
      name: req.body.name,
  });
  res.status(201).json(brand);
});

// Modifica una marca por su nombre
router.put('/:name', async (req, res) => {
  await BrandModel.updateOne({ name: req.params.name }, { $set: { name: req.body.name } });
  res.status(202).json({ message: 'Successfully modified' });
});

// Elimina una marca por su nombre
router.delete('/:name', async (req, res) => {
  await BrandModel.deleteOne({ name: req.params.name });
  res.status(202).json({ message: 'Successfully deleted' });
});

export default router;
