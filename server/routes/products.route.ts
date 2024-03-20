import { Router } from "express";
import ProductsModel from '../collections/products.collection';

const router = Router();

// Obtiene todos los productos
// router.get('/', async (req, res) => {
//     const allProducts = await ProductsModel.find({}).lean().exec();
//     res.status(200).json(allProducts);
// });

router.get('/', async (req, res) => {
    const { limit, offset } = req.query;
    const limitValue: number = limit ? parseInt(limit.toString()) : 10;
    const offsetValue: number = offset ? parseInt(offset.toString()) : 0;

    try {
        // Consulta para obtener la lista de servicios paginada
        const products = await ProductsModel.find({})
            .skip(offsetValue)
            .limit(limitValue)
            .lean()
            .exec();

        // Consulta para obtener el número total de servicios
        const totalCount = await ProductsModel.countDocuments();

        // Enviar la respuesta con la lista de servicios y el total de servicios
        res.status(200).json({
            products: products,
            totalCount: totalCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

// Obtiene un producto por su nombre
router.get('/:name', async (req, res) => {
    const { name } = req.params;
    const productWithName = await ProductsModel.find({ name }).lean().exec();

    if (productWithName.length === 0) {
        res.status(404).json({ message: `No records with ${name} name` });
    } else {
        res.status(200).json(productWithName[0]);
    }
});
router.get('/category/:categoryId', async (req, res) => {
    const { categoryId } = req.params;
    try {
        const products = await ProductsModel.find({ categoryId }).lean().exec();
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// Crea un nuevo producto
router.post('/', async (req, res) => {
  await ProductsModel.create({
      name: req.body.name,
      description: req.body.description,
      brandId: req.body.brandId,
      typeId: req.body.typeId,
      price: req.body.price,
      categoryId: req.body.categoryId,
      subcategoryId: req.body.subcategoryId,
      images: req.body.images,
  });
  res.status(201).json({ message: 'Successfully created' });
});

// Modifica un producto por su nombre
router.put('/:name', async (req, res) => {
    const { name } = req.params;
    const productWithName = await ProductsModel.find({ name }).lean().exec();
    if (productWithName.length === 0) {
        res.status(404).json({ message: `No records with ${name} name` });
        return;
    }
  await ProductsModel.updateOne({ name: req.params.name }, { $set: {
      name: req.body.name,
      description: req.body.description,
      brandId: req.body.brandId,
      typeId: req.body.typeId,
      price: req.body.price,
      categoryId: req.body.categoryId,
      subcategoryId: req.body.subcategoryId,
      images: req.body.images,
  } });
  res.status(202).json({ message: 'Successfully modified' });
});

// Elimina un producto por su nombre
router.delete('/:name', async (req, res) => {
    const { name } = req.params;
    const productWithName = await ProductsModel.find({ name }).lean().exec();
    if (productWithName.length === 0) {
        res.status(404).json({ message: `No records with ${name} name` });
        return;
    }
    await ProductsModel.deleteOne({ name: req.params.name });
    res.status(202).json({ message: 'Successfully deleted' });
});

export default router;
