import { Router } from "express";
import DataModel from '../collections/data.collection';

const router = Router();

// Obtiene la data
router.get('/', async (req, res) => {
    const data = await DataModel.find({}).lean().exec();
    res.status(200).json(data);
});
// Obtiene todo el texto (misión, visión, slogan, etc.)
router.get('/text', async (req, res) => {
  const data = await DataModel.findOne({}, 'slogan description mision vision productsTitle productsParagraph servicesTitle servicesParagraph').lean().exec();
  res.status(200).json(data);
});

// Obtiene el logo
router.get('/logo', async (req, res) => {
  const data = await DataModel.findOne({}, 'logo').lean().exec();
  res.status(200).json(data);
});

// Obtiene las imágenes de visión
router.get('/visionImages', async (req, res) => {
  const data = await DataModel.findOne({}, 'visionImages').lean().exec();
  res.status(200).json(data);
});

// Obtiene las imágenes de presentación
router.get('/presentationImages', async (req, res) => {
  const data = await DataModel.findOne({}, 'presentationImages').lean().exec();
  res.status(200).json(data);
});
// // Modifica los textos
// router.put('/texts', async (req, res) => {
//   const data = await DataModel.findOneAndUpdate({}, { $set: {
//     slogan: req.body.slogan,
//     description: req.body.description,
//     mision: req.body.mision,
//     vision: req.body.vision,
//     productsTitle: req.body.productsTitle,
//     productsParagraph: req.body.productsParagraph,
//     servicesTitle: req.body.servicesTitle,
//     servicesParagraph: req.body.servicesParagraph,
//   } }, { new: true });
//   if (!data) { return res.status(404).json({ message: 'No records found' }); }
//   return res.status(202).json({ message: 'Successfully modified', data });
// });

// // Modifica las imágenes de visión
// router.put('/vision-images', async (req, res) => {
//   const data = await DataModel.findOneAndUpdate({}, { $set: {
//     visionImages: req.body.visionImages,
//   } }, { new: true });
//   if (!data) { return res.status(404).json({ message: 'No records found' }); }
//   return res.status(202).json({ message: 'Successfully modified', data });
// });

// // Modifica las imágenes de presentación
// router.put('/presentation-images', async (req, res) => {
//   const data = await DataModel.findOneAndUpdate({}, { $set: {
//     presentationImages: req.body.presentationImages,
//   } }, { new: true });
//   if (!data) { return res.status(404).json({ message: 'No records found' }); }
//   return res.status(202).json({ message: 'Successfully modified', data });
// });

// // Modifica el logo
// router.put('/logo', async (req, res) => {
//   const data = await DataModel.findOneAndUpdate({}, { $set: {
//     logo: req.body.logo,
//   } }, { new: true });
//   if (!data) { return res.status(404).json({ message: 'No records found' }); }
//   return res.status(202).json({ message: 'Successfully modified', data });
// });

export default router;
