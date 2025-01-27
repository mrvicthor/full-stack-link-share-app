import { FastifyRequest, FastifyReply } from "fastify";
import { CreateLinkInput } from "../schemas/user.schema";
import { createLink } from "../service/link.service";

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
