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
    footerAbout: { type: String },
    servicesPage: { type: mongoose.Schema.Types.Mixed, default: undefined },
    nosotrosDescription: { type: String },
    historiaList: {
        type: [{ year: String, title: String, desc: String }],
        default: [],
    },
    valoresList: {
        type: [{ icon: String, title: String, desc: String }],
        default: [],
    },
    nosotrosPage: { type: mongoose.Schema.Types.Mixed, default: undefined },
    homeHero: { type: mongoose.Schema.Types.Mixed, default: undefined },
});

export default mongoose.model('Data', dataSchema);

