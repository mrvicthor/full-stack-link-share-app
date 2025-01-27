import mongoose, { Document, Schema, Types } from "mongoose";

export interface LinkDocument extends Document {
  _id: Types.ObjectId;
  platform: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  owner: Types.ObjectId;
  omitIrrelevantProperties: () => Pick<
    LinkDocument,
    "_id" | "platform" | "url" | "owner"
  >;
}

const linkSchema = new Schema<LinkDocument>(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    platform: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

linkSchema.methods.omitIrrelevantProperties = function () {
  const link = this.toObject();
  delete link.createdAt;
  delete link.updatedAt;
  return link;
};

const LinkModel = mongoose.model<LinkDocument>("Link", linkSchema);

export default LinkModel;
