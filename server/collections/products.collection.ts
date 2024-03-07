import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    brandId: { type: String },
    typeId: { type: String },
    price: { type: Number },
    categoryId: { type: String },
    subcategoryId: { type: String },
    images: { type: [Buffer] },
});

export default mongoose.model('Products', productsSchema);

