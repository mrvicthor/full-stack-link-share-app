"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const hashPassword = async (value, saltRound) => bcrypt_1.default.hash(value, saltRound || 10);
exports.hashPassword = hashPassword;
const comparePassword = async (value, hash) => bcrypt_1.default.compare(value, hash).catch(() => false);
exports.comparePassword = comparePassword;
