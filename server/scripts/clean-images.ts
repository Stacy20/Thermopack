import 'dotenv/config';
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import mongoose from 'mongoose';
import ProductsModel from '../collections/products.collection';
import ServicesModel from '../collections/services.collection';
import ContactModel from '../collections/contact.collection';
import DataModel from '../collections/data.collection';

const isValidUrl = (v: unknown): v is string =>
    typeof v === 'string' && v.startsWith('http');

async function cleanImageArrayField(
    model: mongoose.Model<unknown>,
    field: string
): Promise<number> {
    const docs = await (model as mongoose.Model<Record<string, unknown>>).find({}).lean().exec();
    let cleaned = 0;
    for (const doc of docs) {
        const raw = (doc as Record<string, unknown>)[field];
        const current: unknown[] = Array.isArray(raw) ? raw : [];
        const valid = current.filter(isValidUrl);
        if (valid.length !== current.length) {
            await (model as mongoose.Model<Record<string, unknown>>).updateOne(
                { _id: (doc as Record<string, unknown>)._id },
                { $set: { [field]: valid } }
            );
            cleaned++;
        }
    }
    return cleaned;
}

async function main() {
    const connectionString = process.env.MONGODB_URI;
    if (!connectionString) throw new Error('MONGODB_URI no está definido en .env');

    await mongoose.connect(connectionString);
    console.log('Conectado a MongoDB');

    // Products — campo images
    const productsFixed = await cleanImageArrayField(ProductsModel as mongoose.Model<unknown>, 'images');
    console.log(`Products:  ${productsFixed} documentos actualizados`);

    // Services — campo images
    const servicesFixed = await cleanImageArrayField(ServicesModel as mongoose.Model<unknown>, 'images');
    console.log(`Services:  ${servicesFixed} documentos actualizados`);

    // Contact — campo images
    const contactFixed = await cleanImageArrayField(ContactModel as mongoose.Model<unknown>, 'images');
    console.log(`Contact:   ${contactFixed} documentos actualizados`);

    // Data — campos visionImages, presentationImages y logo
    const dataDoc = await DataModel.findOne({}).lean().exec();
    if (dataDoc) {
        const updates: Record<string, unknown> = {};

        const visionRaw = (dataDoc as Record<string, unknown>).visionImages;
        const vision: unknown[] = Array.isArray(visionRaw) ? visionRaw : [];
        const visionClean = vision.filter(isValidUrl);
        if (visionClean.length !== vision.length) updates.visionImages = visionClean;

        const presentationRaw = (dataDoc as Record<string, unknown>).presentationImages;
        const presentation: unknown[] = Array.isArray(presentationRaw) ? presentationRaw : [];
        const presentationClean = presentation.filter(isValidUrl);
        if (presentationClean.length !== presentation.length) updates.presentationImages = presentationClean;

        const logo = (dataDoc as Record<string, unknown>).logo;
        if (!isValidUrl(logo)) updates.logo = null;

        if (Object.keys(updates).length > 0) {
            await DataModel.updateOne({ _id: (dataDoc as Record<string, unknown>)._id }, { $set: updates });
            console.log('Data:      1 documento actualizado —', Object.keys(updates).join(', '));
        } else {
            console.log('Data:      sin cambios necesarios');
        }
    }

    await mongoose.disconnect();
    console.log('\nLimpieza completada. Las imágenes base64 fueron eliminadas.');
}

main().catch((err) => {
    console.error('Error:', err);
    process.exit(1);
});
