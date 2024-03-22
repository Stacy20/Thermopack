import { Router } from "express";
import ContactModel from '../collections/contact.collection';

const router = Router();

// Obtiene la contactData
router.get('/', async (req, res) => {
  const contactData = await ContactModel.find({}).lean().exec();
  res.status(200).json(contactData);
});

// Modifica la contactData
router.put('/', async (req, res) => {
  const contactData = await ContactModel.findOneAndUpdate({}, { $set: {
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
    images: req.body.images,

  } }, { new: true });
  if (!contactData) { return res.status(404).json({ message: 'No records found' });}
  return res.status(202).json({ message: 'Successfully modified', contactData });
});

export default router;
