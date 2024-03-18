import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
    slogan: { type: String },
    description: { type: String },
    mision: { type: String },
    vision: { type: String },
    logo: { type: String },
    visionImages: { type: [String] },
    presentationImages: { type: [String] },
    productsTitle: { type: String },
    productsParagraph: { type: String },
    servicesTitle: { type: String },
    servicesParagraph: { type: String },
});

export default mongoose.model('Data', dataSchema);

