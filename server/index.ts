import mongoose from 'mongoose';
import express from 'express';


// Routes
import BrandsRouter from './routes/brands.route';
import UsersRouter from './routes/users.route';

const app = express();
const port = 3000;

app.use(express.json()); // <- Esta linea permite que se accese el body

app.use('/brands', BrandsRouter);
app.use('/users', UsersRouter);

// const authenticationMiddleware = (req: Request, result: Response, next: () => any) => {
//     if (req.headers.authorization === 'Basic andres:obando') {
//         next();
//     }
//     else {
//         return result.status(401).json({ message: 'El usuario no esta autorizado' });
//     }
// }

const connectionString = 'mongodb+srv://thermopackdev:stacyalonsoyraquel123.@maincluster.xawfxad.mongodb.net/thermopack';


const main = async () => {
    await mongoose.connect(connectionString);
    app.listen(port, () => {
        console.log(`La aplicación está escuchando en el puerto ${port}`);
    });
};

main();

