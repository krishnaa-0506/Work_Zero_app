import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  description: string;
  location: {
    address: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  salary: {
    amount: number;
    period: 'hour' | 'day' | 'week' | 'month';
  };
  category: string;
  workingHours: string;
  requirements: string[];
  isActive: boolean;
  applications: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    location: {
      address: { type: String, required: true },
      coordinates: {
        type: [Number],
        required: true,
        index: '2dsphere'
      }
    },
    salary: {
      amount: { type: Number, required: true },
      period: { type: String, enum: ['hour', 'day', 'week', 'month'], required: true }
    },
    category: { type: String, required: true },
    workingHours: { type: String, required: true },
    requirements: [String],
    isActive: { type: Boolean, default: true },
    applications: [{ type: Schema.Types.ObjectId, ref: 'JobApplication' }]
  },
  { timestamps: true }
);

// Index for location-based queries
jobSchema.index({ 'location.coordinates': '2dsphere' });

// Index for text search
jobSchema.index({
  title: 'text',
  description: 'text',
  category: 'text',
  'location.address': 'text'
});

export default mongoose.model<IJob>('Job', jobSchema);
