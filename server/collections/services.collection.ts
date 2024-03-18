import mongoose from "mongoose";

const servicesSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    price: { type: Number },
    images: { type: [String] },
});

export default mongoose.model('Services', servicesSchema);
