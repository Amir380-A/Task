import mongoose, { Document, Schema } from 'mongoose';

export interface User extends Document {
    _id: mongoose.Types.ObjectId; 
    name: string;
    email: string;
    password: string;
}

const userSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const UserModel = mongoose.model<User>('User', userSchema);
export default UserModel;
