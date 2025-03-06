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
exports.showOrderRouter = void 0;
const express_1 = __importDefault(require("express"));
const common_1 = require("@hnticketing/common");
const order_1 = require("./models/order");
const router = express_1.default.Router();
exports.showOrderRouter = router;
router.get('/api/orders/:orderId', common_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_1.Order.findById(req.params.orderId).populate('ticket');
    if (!order) {
        throw new common_1.NotFoundError();
    }
    if (order.userId !== req.currentUser.email) {
        throw new common_1.NotAuthorizedError();
    }
    res.send(order);
}));
