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
exports.expirationQueue = void 0;
const bull_1 = __importDefault(require("bull"));
const nats_wrapper_1 = require("../nats-wrapper");
const expiration_complete_publisher_1 = require("../events/publishers/expiration-complete-publisher");
const expirationQueue = new bull_1.default("order:expiration", {
    redis: {
        host: process.env.REDIS_HOST
    }
});
exports.expirationQueue = expirationQueue;
expirationQueue.process((job) => __awaiter(void 0, void 0, void 0, function* () {
    //   console.log("Publishing an expiration:complete event for orderId",
    //        job.data.orderId);
    new expiration_complete_publisher_1.ExpirationCompletePublisher(nats_wrapper_1.natsWrapper.client).publish({ orderId: job.data.orderId });
}));
