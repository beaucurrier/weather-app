import mongoose, { Document, Schema, Types } from 'mongoose';
import { ICity } from './City'; // Importing the ICity interface from the City model file

// Define the IUser interface extending Mongoose's Document interface
// This interface represents the structure of a User document in MongoDB
export interface IUser extends Document {
  email: string; // Email of the user, required and unique
  name: string;  // Name of the user, required
  password?: string; // Password field
  image?: string; // Optional URL for the user's profile image
  favoriteCities?: ICity[]; // Optional array of city references (full City objects)
  emailVerified?: boolean;
  token?: string | null;
  tokenExpiry?: Date | null;

}

// Define the User schema which outlines the structure of the user document in the database
const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true }, // Email is required and must be unique
  name: { type: String, required: true }, // Name is required
  password: { type: String }, // Password is required
  image: { type: String, default: '' }, // Optional image field for the user's profile picture
  favoriteCities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'City', default: [] }], // Optional array of ObjectIds referencing the City model, defaults to an empty array
  emailVerified: {type: Boolean, default: false},
  token: {type: String, default: null},
  tokenExpiry: {type: Date, default: null}
});

// Export the User model, checking if it's already registered in Mongoose
// If the model is already registered (mongoose.models.User), it uses that model
// Otherwise, it creates a new model using the UserSchema
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);