"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signoutRouter = void 0;
const express_1 = __importDefault(require("express"));
const ruoter = express_1.default.Router();
exports.signoutRouter = ruoter;
ruoter.post("/api/users/signout", (req, res) => {
    req.session = null;
    res.send({});
});
