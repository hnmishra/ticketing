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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../app");
const mongoose_1 = __importDefault(require("mongoose"));
it('returns a 404 if the ticket is not found', () => __awaiter(void 0, void 0, void 0, function* () {
    const toMongoId = new mongoose_1.default.Types.ObjectId().toHexString();
    yield (0, supertest_1.default)(app_1.app)
        .get(`/api/tickets/${toMongoId}`)
        .send()
        .expect(404);
    //console.log(res.body);
}));
it('returns the ticket if the ticket is found', () => __awaiter(void 0, void 0, void 0, function* () {
    const title = 'concert';
    const price = 20;
    const response = yield (0, supertest_1.default)(app_1.app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
        title,
        price,
    })
        .expect(201);
    const ticketResponse = yield (0, supertest_1.default)(app_1.app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);
    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
}));
