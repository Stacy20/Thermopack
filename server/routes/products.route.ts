import { Router } from "express";
import ProductsModel from '../collections/products.collection';

const router = Router();

// // Obtiene todos los productos
// router.get('/', async (req, res) => {
//     const allProducts = await ProductsModel.find({}).lean().exec();
//     res.status(200).json(allProducts);
// });

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
// router.get('/', async (req, res) => {
//     const { limit, offset } = req.query;
//     const limitValue: number = limit ? parseInt(limit.toString()) : 10;
//     const offsetValue: number = offset ? parseInt(offset.toString()) : 0;

//     try {
//         // Consulta para obtener la lista de servicios paginada
//         const services = await ServicesModel.find({})
//             .skip(offsetValue)
//             .limit(limitValue)
//             .lean()
//             .exec();

//         // Consulta para obtener el número total de servicios
//         const totalCount = await ServicesModel.countDocuments();

//         // Enviar la respuesta con la lista de servicios y el total de servicios
//         res.status(200).json({
//             services: services,
//             totalCount: totalCount
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error interno del servidor" });
//     }
// });
router.get('/', async (req, res) => {
    const { limit, offset, brandId , categoryId, typeId, name } = req.query;

    // Definir un tipo para el objeto de filtro
    interface Filter {
        brandId ?: string;
        categoryId?: string;
        typeId?: string;
        name?: { $regex: string, $options: string };
    }

    // Crear un objeto de filtro basado en los parámetros recibidos
    const filter: Filter = {};
    if (brandId ) filter.brandId  = brandId  as string;
    if (categoryId) filter.categoryId = categoryId as string;
    if (typeId) filter.typeId = typeId as string;
    if (name) filter.name = { $regex: name as string, $options: 'i' };

    const products = await ProductsModel.find(filter).skip(parseInt(offset as string)).limit(parseInt(limit as string)).lean().exec();
    const totalCount =  await ProductsModel.countDocuments(filter);
    res.status(200).json({
                    products: products,
                    totalCount: totalCount
                });
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
