"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = dbConnector;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function dbConnector(server) {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        server.log.info("Connected to DB");
    }
    catch (error) {
        server.log.error(`Error connecting to DB ${error}`);
    }
}
