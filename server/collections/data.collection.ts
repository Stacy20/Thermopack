import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
    id: { type: String },
    slogan: { type: String },
    description: { type: String },
    mision: { type: String },
    vision: { type: String },
    logo: { type: Buffer },
    visionImages: { type: [Buffer] },
    presentationImages: { type: [Buffer] },
    productsTitle: { type: String },
    productsParagraph: { type: String },
    servicesTitle: { type: String },
    servicesParagraph: { type: String },
});

export default mongoose.model('Data', dataSchema);

