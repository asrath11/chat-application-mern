import mongoose, { Document, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  refreshToken?: string;
  comparePassword(enteredPassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserModel extends Model<IUser> {}
const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    avatar: {
      type: String,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre<IUser>('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser, IUserModel>('User', userSchema);
export default User;
