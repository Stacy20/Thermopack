import { Router } from "express";
import DataModel from '../collections/data.collection';

const router = Router();

// Obtiene la data
router.get('/', async (req, res) => {
    const data = await DataModel.find({}).lean().exec();
    res.status(200).json(data);
});

// Modifica la data
router.put('/', async (req, res) => {
  const data = await DataModel.findOneAndUpdate({}, { $set: {
    slogan: req.body.slogan,
    description: req.body.description,
    mision: req.body.mision,
    vision: req.body.vision,
    logo: req.body.logo,
    visionImages: req.body.visionImages,
    presentationImages: req.body.presentationImages,
    productsTitle: req.body.productsTitle,
    productsParagraph: req.body.productsParagraph,
    servicesTitle: req.body.servicesTitle,
    servicesParagraph: req.body.servicesParagraph,
  } }, { new: true });
  if (!data) { return res.status(404).json({ message: 'No records found' });}
  return res.status(202).json({ message: 'Successfully modified', data });
});


export default router;
