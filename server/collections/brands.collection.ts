import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
    }
});

export default mongoose.model('Brand', brandSchema);
