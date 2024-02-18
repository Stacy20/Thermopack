import mongoose from "mongoose";

const typesSchema = new mongoose.Schema({
    id: { type: String },
    name: { type: String },
});

export default mongoose.model('Types', typesSchema);

