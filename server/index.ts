import 'dotenv/config';
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';


// Routes
import BrandsRouter from './routes/brands.route';
import CategoriesRouter from './routes/categories.route';
import DataRouter from './routes/data.route';
import PrivilegesRouter from './routes/privileges.route';
import ProductsRouter from './routes/products.route';
import ServicesRouter from './routes/services.route';
import TypesRouter from './routes/types.route';
import UsersRouter from './routes/users.route';
import ContactRouter from './routes/contact.route';
import UploadRouter from './routes/upload.route';
import * as bodyParser from 'body-parser';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));
app.use(express.json()); // <- Esta linea permite que se accese el body

app.use(cors());

app.use('/server/brands', BrandsRouter);
app.use('/server/categories', CategoriesRouter);
app.use('/server/data', DataRouter);
app.use('/server/privileges', PrivilegesRouter);
app.use('/server/products', ProductsRouter);
app.use('/server/services', ServicesRouter);
app.use('/server/types', TypesRouter);
app.use('/server/users', UsersRouter);
app.use('/server/contact', ContactRouter);
app.use('/server/upload', UploadRouter);


const connectionString = process.env.MONGODB_URI;
if (!connectionString) {
    throw new Error('MONGODB_URI is not set. Copy server/.env.example to server/.env and set MONGODB_URI.');
}

const main = async () => {
    await mongoose.connect(connectionString);
    app.listen(port, () => {
        console.log(`La aplicación está escuchando en el puerto ${port}`);
    });
};

main();

