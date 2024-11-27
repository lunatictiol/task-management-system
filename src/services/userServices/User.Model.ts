import mongoose, { Schema, Document } from 'mongoose';

export interface UserType extends Document {
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model<UserType>('User', UserSchema,"Users");
export default User;