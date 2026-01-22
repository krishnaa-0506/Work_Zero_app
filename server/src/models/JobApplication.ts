import mongoose, { Document, Schema } from 'mongoose';

export interface IJobApplication extends Document {
  job: mongoose.Types.ObjectId;
  applicant: mongoose.Types.ObjectId;
  status: 'pending' | 'reviewing' | 'interview_scheduled' | 'approved' | 'rejected';
  timeline: {
    status: string;
    date: Date;
    notes?: string;
  }[];
  currentStep: number;
  interview?: {
    date: Date;
    type: 'in_person' | 'phone' | 'video';
    location?: string;
    notes?: string;
  };
  feedback?: {
    rating: number;
    comment: string;
    date: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const jobApplicationSchema = new Schema<IJobApplication>(
  {
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    applicant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'interview_scheduled', 'approved', 'rejected'],
      default: 'pending'
    },
    timeline: [{
      status: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      },
      notes: String
    }],
    currentStep: {
      type: Number,
      default: 1
    },
    interview: {
      date: Date,
      type: {
        type: String,
        enum: ['in_person', 'phone', 'video']
      },
      location: String,
      notes: String
    },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      date: Date
    }
  },
  { timestamps: true }
);

// Ensure unique applications per job per user
jobApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export default mongoose.model<IJobApplication>('JobApplication', jobApplicationSchema);
