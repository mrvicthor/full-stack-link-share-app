"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLink = void 0;
const link_model_1 = __importDefault(require("../models/link.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const createLink = async ({ links, owner }) => {
    const user = await user_model_1.default.findById(owner);
    const newLinks = links.map((link) => ({
        ...link,
        owner,
    }));
    if (!user) {
        throw new Error("User not found");
    }
    const createdLinks = await link_model_1.default.insertMany(newLinks);
    const linkProperties = createdLinks.map((link) => ({
        platform: link.platform,
        url: link.url,
        owner: link.owner,
        _id: link._id,
    }));
    const updatedUser = await user_model_1.default.findByIdAndUpdate(owner, {
        $addToSet: {
            links: { $each: linkProperties },
        },
    }, {
        new: true,
        runValidators: true,
    });
    if (!updatedUser) {
        await link_model_1.default.deleteMany({
            _id: { $in: createdLinks.map((link) => link._id) },
        });
        throw new Error("Failed to update user with new link");
    }
    return { updatedUser };
};
exports.createLink = createLink;
