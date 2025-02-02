"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpdateLink = exports.handleDeleteLink = exports.handleGetLinks = exports.handleCreateLink = void 0;
const link_service_1 = require("../service/link.service");
const user_model_1 = __importDefault(require("../models/user.model"));
const link_model_1 = __importDefault(require("../models/link.model"));
const handleCreateLink = async (request, reply) => {
    const links = request.body;
    const { updatedUser } = await (0, link_service_1.createLink)({
        links,
        owner: request.user.id,
    });
    reply.code(201).send({ user: updatedUser });
};
exports.handleCreateLink = handleCreateLink;
const handleGetLinks = async (request, reply) => {
    const userId = request.user.id;
    const user = await user_model_1.default.findById(userId);
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
exports.handleGetLinks = handleGetLinks;
const handleDeleteLink = async (request, reply) => {
    const { id } = request.params;
    try {
        await link_model_1.default.findOneAndDelete({
            _id: id,
            owner: request.user.id,
        });
        await user_model_1.default.updateOne({ _id: request.user.id }, {
            $pull: {
                links: { _id: id },
            },
        });
    }
    catch (error) {
        return reply.code(404).send({ message: "Link not found" });
    }
};
exports.handleDeleteLink = handleDeleteLink;
const handleUpdateLink = async (request, reply) => {
    const { id } = request.params;
    try {
        const updatedLink = await link_model_1.default.findByIdAndUpdate(id, request.body, {
            new: true,
            runValidators: true,
        });
        await user_model_1.default.updateOne({ _id: request.user.id, "links._id": id }, {
            $set: {
                "links.$.platform": updatedLink?.platform,
                "links.$.url": updatedLink?.url,
            },
        });
        return reply.code(200).send({ message: "Link successfully updated" });
    }
    catch (error) {
        return reply.code(404).send({ message: "Link not found" });
    }
};
exports.handleUpdateLink = handleUpdateLink;
