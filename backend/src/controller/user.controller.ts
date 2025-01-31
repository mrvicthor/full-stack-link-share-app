import { FastifyReply, FastifyRequest } from "fastify";
import UserModel from "../models/user.model";

export const handlePreview = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const user = await UserModel.findById(id);
  if (!user) {
    return reply.code(404).send({ message: "User not found" });
  }
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
