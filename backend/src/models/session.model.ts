import mongoose, { Document, Schema } from "mongoose";

export interface SessionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
}

const sessionSchema = new Schema<SessionDocument>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    index: true,
  },
  userAgent: {
    type: String,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
});

const SessionModel = mongoose.model<SessionDocument>(
  "Session",
  sessionSchema,
  "sessions"
);

export default SessionModel;
