import mongoose from "mongoose";
import dotenv from "dotenv";
import { FastifyInstance } from "fastify";

dotenv.config();

export default async function dbConnector(server: FastifyInstance) {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    server.log.info("Connected to DB");
  } catch (error) {
    server.log.error(`Error connecting to DB ${error}`);
  }
}
