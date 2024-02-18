import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    id: { type: String },
    email:{ type: String },
    password: { type: String },
    privileges: { type: [String] },
});

export default mongoose.model('Users', usersSchema);
