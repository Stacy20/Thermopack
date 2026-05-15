import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    brandId: { type: String },
    typeId: { type: String },
    price: { type: Number },
    listPrice: { type: Number },
    rating: { type: Number },
    features: { type: [String], default: [] },
    categoryId: { type: String },
    subcategoryId: { type: String },
    images: { type: [String] },
});

export default mongoose.model('Products', productsSchema);

