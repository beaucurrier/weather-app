import mongoose, { Schema, Document } from 'mongoose';
import { ICity } from "./City";

export interface IUser extends Document {
  name: string;
  email: string;
  image: string;
  favoriteCities: ICity[]; // Reference to City model
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  favoriteCities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'City' }],
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
