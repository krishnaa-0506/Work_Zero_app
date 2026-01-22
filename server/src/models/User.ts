import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  aadhaarNumber: string;
  phoneNumber: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: Date;
  address: string;
  profilePicture?: string;
  isVerified: boolean;
  verifiedAt?: Date;
  skills: string[];
  experience: {
    title: string;
    company: string;
    duration: number;
    description?: string;
  }[];
  applications: mongoose.Types.ObjectId[];
  conversations: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    aadhaarNumber: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    dateOfBirth: { type: Date, required: true },
    address: { type: String, required: true },
    profilePicture: String,
    isVerified: { type: Boolean, default: false },
    verifiedAt: Date,
    skills: [String],
    experience: [{
      title: { type: String, required: true },
      company: { type: String, required: true },
      duration: { type: Number, required: true }, // in months
      description: String
    }],
    applications: [{ type: Schema.Types.ObjectId, ref: 'JobApplication' }],
    conversations: [{ type: Schema.Types.ObjectId, ref: 'Conversation' }]
  },
  { timestamps: true }
);

userSchema.pre('save', async function(next) {
  if (!this.isModified('aadhaarNumber')) return next();
  
  try {
    // Hash Aadhaar number before saving
    const salt = await bcrypt.genSalt(10);
    const hashedAadhaar = await bcrypt.hash(this.aadhaarNumber, salt);
    this.aadhaarNumber = hashedAadhaar;
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.aadhaarNumber);
  } catch (error) {
    throw error;
  }
};

export default mongoose.model<IUser>('User', userSchema);
