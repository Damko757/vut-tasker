import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { type User } from "../../../shared/Entities/User.ts";
const UserSchema = new mongoose.Schema({
    nick: { type: String, unique: true, required: true },
    fullname: { type: String, required: true },
    color: { type: String, required: true }, //Hex
    show_my_progress: { type: Boolean, default: true },
    show_me_progress: { type: Boolean, default: true },
    subscribed_subjects: { type: Array, default: [] },
});

UserSchema.plugin(uniqueValidator);

export const UserModel = mongoose.model<User>("User", UserSchema);
