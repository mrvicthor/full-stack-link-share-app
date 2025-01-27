import mongoose, { Schema, Document } from "mongoose";
import { comparePassword, hashPassword } from "../utils/hash";

interface ILink {
  _id: Schema.Types.ObjectId;
  platform: string;
  url: string;
}

export interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image: {
    data: Buffer;
    contentType: string;
  };
  links: ILink[];
  _v?: number;
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    image: {
      data: Buffer,
      contentType: String,
    },
    links: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: "Link",
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
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await hashPassword(this.password);
  next();
});

userSchema.methods.comparePassword = async function (value: string) {
  return comparePassword(value, this.password);
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
