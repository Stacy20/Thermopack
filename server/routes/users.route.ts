import { Router } from "express";
import UsersModel from '../collections/users.collection';

const router = Router();

// Obtiene todos los usuarios
router.get('/', async (req, res) => {
    const allUsers = await UsersModel.find({}).lean().exec();
    res.status(200).json(allUsers);
});

// Obtiene un usuario por su nombre
router.get('/:email', async (req, res) => {
    const { email } = req.params;
    const userWithEmail = await UsersModel.find({ email }).lean().exec();

    if (userWithEmail.length === 0) {
        res.status(404).json({ message: `No records with ${email} name` });
    } else {
        res.status(200).json(userWithEmail[0]);
    }
});

// Crea un nuevo usuario
router.post('/', async (req, res) => {
    const user = await UsersModel.create({
      email: req.body.email,
      password: req.body.password,
      privileges: req.body.privileges,
    });
    res.status(201).json(user);
});

// Modifica un usuario por su nombre
router.put('/:email', async (req, res) => {
    const { email } = req.params;
    const userWithEmail = await UsersModel.find({ email }).lean().exec();
    if (userWithEmail.length === 0) {
        res.status(404).json({ message: `No records with ${email} name` });
        return;
    }
    await UsersModel.updateOne({ email: req.params.email }, { $set: {
        email: req.body.email,
        password: req.body.password,
        privileges: req.body.privileges,
    } });
    res.status(202).json({ message: 'Successfully modified' });
});

// Elimina un usuario por su nombre
router.delete('/:email', async (req, res) => {
    const { email } = req.params;
    const userWithEmail = await UsersModel.find({ email }).lean().exec();
    if (userWithEmail.length === 0) {
        res.status(404).json({ message: `No records with ${email} name` });
        return;
    }
    await UsersModel.deleteOne({ email: req.params.email });
    res.status(202).json({ message: 'Successfully deleted' });
});

export default router;
