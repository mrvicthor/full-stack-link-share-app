import { FastifyRequest, FastifyReply } from "fastify";
import { CreateLinkInput } from "../schemas/user.schema";
import { createLink } from "../service/link.service";
import UserModel from "../models/user.model";
import LinkModel from "../models/link.model";

export const handleCreateLink = async (
  request: FastifyRequest<{ Body: CreateLinkInput[] }>,
  reply: FastifyReply
) => {
  const links = request.body;
  console.log(links);
  const { updatedUser } = await createLink({
    links,
    owner: request.user.id,
  });

  reply.code(201).send({ user: updatedUser });
};

export const handleGetLinks = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const userId = request.user.id;
  const user = await UserModel.findById(userId);
  const userToReturn = {
    _id: user?._id,
    email: user?.email,
    firstName: user?.firstName,
    lastName: user?.lastName,
    image: user?.image,
    links: user?.links,
  };
  return reply.code(200).send({ userToReturn });
};

export const handleDeleteLink = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  try {
    await LinkModel.findOneAndDelete({
      _id: id,
      owner: request.user.id,
    });

    await UserModel.updateOne(
      { _id: request.user.id },
      {
        $pull: {
          links: { _id: id },
        },
      }
    );
  } catch (error) {
    return reply.code(404).send({ message: "Link not found" });
  }
};

export const handleUpdateLink = async (
  request: FastifyRequest<{ Body: CreateLinkInput; Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  try {
    const updatedLink = await LinkModel.findByIdAndUpdate(id, request.body, {
      new: true,
      runValidators: true,
    });

    await UserModel.updateOne(
      { _id: request.user.id, "links._id": id },
      {
        $set: {
          "links.$.platform": updatedLink?.platform,
          "links.$.url": updatedLink?.url,
        },
      }
    );
    return reply.code(200).send({ message: "Link successfully updated" });
  } catch (error) {
    return reply.code(404).send({ message: "Link not found" });
  }
};
