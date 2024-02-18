import mongoose from "mongoose";

const privilegesSchema = new mongoose.Schema({
    id: { type: String },
    name: { type: String },
});

export default mongoose.model('Privileges', privilegesSchema);
