import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
	userName: string;
	email: string;
	password: string;
}

const userSchema: Schema = new Schema({
	userName: { type: String },
	email: { type: String },
	password: { type: String }
});

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);