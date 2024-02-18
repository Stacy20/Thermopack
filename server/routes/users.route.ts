import { Router } from "express";
import UsersModel from '../collections/users.collection';

const router = Router();

// Obtiene todos los usuarios
router.get('/', async (req, res) => {
    const allUsers = await UsersModel.find({}).lean().exec();
    res.status(200).json(allUsers);
});

// Obtiene un usuario por su nombre
router.get('/:name', async (req, res) => {
    const { name } = req.params;
    const userWithName = await UsersModel.find({ name }).lean().exec();

    if (userWithName.length === 0) {
        res.status(404).json({ message: `No records with ${name} name` });
    } else {
        res.status(200).json(userWithName[0]);
    }
});

// Crea un nuevo usuario
router.post('/', async (req, res) => {
    const user = await UsersModel.create({
      email:{ type: String },
      password: { type: String },
      privileges: { type: [String] },
    });
    res.status(201).json(user);
});

// Modifica un usuario por su nombre
router.put('/:email', async (req, res) => {
    await UsersModel.updateOne({ email: req.params.email }, { $set: {
      email:{ type: String },
      password: { type: String },
      privileges: { type: [String] },
    } });
    res.status(202).json({ message: 'Successfully modified' });
});

// Elimina un usuario por su nombre
router.delete('/:email', async (req, res) => {
    await UsersModel.deleteOne({ email: req.params.email });
    res.status(202).json({ message: 'Successfully deleted' });
});

export default router;
