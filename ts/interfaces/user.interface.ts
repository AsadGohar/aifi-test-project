import { Document } from 'mongoose';

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  is_verified: boolean;
  comparePassword: (password: string) => Promise<boolean>;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
  generateVerificationToken: () => string;
}

export interface ILogin extends Document {
  email: string;
  password: string;
}