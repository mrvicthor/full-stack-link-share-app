import { FastifyRequest, FastifyReply } from "fastify";
import { CreateLinkInput } from "../schemas/user.schema";
import { createLink } from "../service/link.service";
import LinkModel from "../models/link.model";
import UserModel from "../models/user.model";

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
  const links = user?.links;
  return reply.code(200).send({ links });
};
