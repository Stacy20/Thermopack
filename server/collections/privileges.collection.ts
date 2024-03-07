import mongoose from "mongoose";

const privilegesSchema = new mongoose.Schema({
    name: { type: String },
});

export default mongoose.model('Privileges', privilegesSchema);
