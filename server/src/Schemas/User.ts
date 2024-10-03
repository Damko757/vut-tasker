import mongoose from "mongoose";
import { type User } from "../../../shared/Entities/User.ts";
const UserSchema = new mongoose.Schema({
    nick: String,
    fullname: String,
    color: String, //Hex
    show_my_progress: { type: Boolean, default: true },
    show_me_progress: { type: Boolean, default: true },
});

const UserModel = mongoose.model<User>("User", UserSchema);
