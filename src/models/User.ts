import mongoose, { Document, Schema, Model, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface for User document
interface IUser {
  name: string;
  email: string;
  password: string;
  location?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Interface for User document with Mongoose document methods
interface IUserDocument extends IUser, Document {
  // Add any document methods here
}

// Create the schema
const userSchema = new Schema<IUserDocument>({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: { type: String, required: true, select: false },
  location: { type: String, trim: true },
}, { 
  timestamps: true 
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  const user = this as IUserDocument;
  
  if (!user.isModified('password')) {
    return (next as any)();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    (next as any)();
  } catch (error) {
    (next as any)(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);};

// Create and export the model
const User: Model<IUserDocument> = mongoose.models.User || 
  mongoose.model<IUserDocument>('User', userSchema);

export default User;
