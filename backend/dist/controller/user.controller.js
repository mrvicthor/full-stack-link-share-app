"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePreview = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const handlePreview = async (request, reply) => {
    const { id } = request.params;
    const user = await user_model_1.default.findById(id);
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
exports.handlePreview = handlePreview;
