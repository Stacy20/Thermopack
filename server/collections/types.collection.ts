import mongoose from "mongoose";

const typesSchema = new mongoose.Schema({
    name: { type: String },
});

export default mongoose.model('Types', typesSchema);

