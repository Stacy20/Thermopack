import mongoose from 'mongoose';
import express from 'express';
const cors = require('cors');


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
import * as bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
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


const connectionString = 'mongodb+srv://thermopackdev:stacyalonsoyraquel123.@maincluster.xawfxad.mongodb.net/thermopack';


const main = async () => {
    await mongoose.connect(connectionString);
    app.listen(port, () => {
        
    });
};

main();

