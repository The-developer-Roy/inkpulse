import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  profilePic?: string; // ✅ Added profile picture field
  niche?: string; // ✅ Added niche field
  bio?: string; // ✅ Added bio field
  profileCompleted: boolean;
  createdAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    profilePic: { type: String }, // ✅ Added profile picture field
    niche: { type: String }, // ✅ Added niche field
    bio: { type: String }, // ✅ Added bio field
    profileCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
