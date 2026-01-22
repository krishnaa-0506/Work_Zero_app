import mongoose, { Document, Schema } from 'mongoose';

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  jobApplication?: mongoose.Types.ObjectId;
  lastMessage?: {
    content: string;
    sender: mongoose.Types.ObjectId;
    timestamp: Date;
  };
  unreadCount: {
    [key: string]: number; // userId: count
  };
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    jobApplication: { type: Schema.Types.ObjectId, ref: 'JobApplication' },
    lastMessage: {
      content: String,
      sender: { type: Schema.Types.ObjectId, ref: 'User' },
      timestamp: Date
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: {}
    }
  },
  { timestamps: true }
);

// Index for querying conversations by participants
conversationSchema.index({ participants: 1 });

// Index for querying conversations by job application
conversationSchema.index({ jobApplication: 1 });

export default mongoose.model<IConversation>('Conversation', conversationSchema);
