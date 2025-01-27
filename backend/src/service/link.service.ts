import mongoose from "mongoose";
import LinkModel from "../models/link.model";
import UserModel from "../models/user.model";
import { LinkProps } from "../schemas/user.schema";

type Link = {
  links: LinkProps[];
  owner: string;
};

// links: {
//   platform: string;
//   url: string;
// }
// [];

export const createLink = async ({ links, owner }: Link) => {
  console.log("data", links);
  const user = await UserModel.findById(owner);
  const newLinks = links.map((link) => ({
    ...link,
    owner,
  }));
  if (!user) {
    throw new Error("User not found");
  }

  const createdLinks = await LinkModel.insertMany(newLinks);

  const linkProperties = createdLinks.map((link) => ({
    platform: link.platform,
    url: link.url,
    owner: link.owner,
    _id: link._id,
  }));

  const updatedUser = await UserModel.findByIdAndUpdate(
    owner,
    {
      $addToSet: {
        links: { $each: linkProperties },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedUser) {
    await LinkModel.deleteMany({
      _id: { $in: createdLinks.map((link) => link._id) },
    });
    throw new Error("Failed to update user with new link");
  }
  return { updatedUser };
};
