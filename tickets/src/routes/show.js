"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showTicketRouter = void 0;
const express_1 = __importDefault(require("express"));
const common_1 = require("@hnticketing/common");
const ticket_1 = require("../models/ticket");
const router = express_1.default.Router();
exports.showTicketRouter = router;
router.get('/api/tickets/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ticket = yield ticket_1.Ticket.findById(req.params.id);
    if (!ticket) {
        throw new common_1.NotFoundError();
    }
    res.send(ticket);
}));
