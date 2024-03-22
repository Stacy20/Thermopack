import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    welcomeParagraph: { type: String },
    ubicationText: { type: String },
    ubicationLink: { type: String },
    telephoneNumbers: { type: [String] },
    email: { type: String },
    whatsappLink: { type: String },
    facebookLink: { type: String },
    instagramLink: { type: String },
    youtubeLink: { type: String },
    images: { type: [String] },
});

export default mongoose.model('Contact', contactSchema);

