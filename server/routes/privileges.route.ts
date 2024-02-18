import { Router } from "express";
import PrivilegesModel from '../collections/privileges.collection';

const router = Router();

// Obtiene todos los privilegios
router.get('/', async (req, res) => {
    const allPrivileges = await PrivilegesModel.find({}).lean().exec();
    res.status(200).json(allPrivileges);
});

// Obtiene un privilegio por su nombre
router.get('/:name', async (req, res) => {
    const { name } = req.params;
    const privilegeWithName = await PrivilegesModel.find({ name }).lean().exec();

    if (privilegeWithName.length === 0) {
        res.status(404).json({ message: `No records with ${name} name` });
    } else {
        res.status(200).json(privilegeWithName[0]);
    }
});

// Crea un nuevo privilegio
router.post('/', async (req, res) => {
    const privilege = await PrivilegesModel.create({
        name: req.body.name,
    });
    res.status(201).json(privilege);
});

// Modifica un privilegio por su nombre
router.put('/:name', async (req, res) => {
    await PrivilegesModel.updateOne({ name: req.params.name }, { $set: { name: req.body.name } });
    res.status(202).json({ message: 'Successfully modified' });
});

// Elimina un privilegio por su nombre
router.delete('/:name', async (req, res) => {
    await PrivilegesModel.deleteOne({ name: req.params.name });
    res.status(202).json({ message: 'Successfully deleted' });
});

export default router;
