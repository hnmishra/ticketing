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
// it('responds with details about the current user', async () => {
//     const cookie = await global.signin();
//     const currentUserResponse = await request(app)
//         .get('/api/users/currentuser')
//         .set('Cookie', cookie)
//         .send()
//         .expect(200);
//         // console.log(currentUserResponse.body);
//     expect(currentUserResponse.body.currentUser.email).toEqual('test@test.com');
// });
it('responds with null if not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
    '';
    const response = yield (0, supertest_1.default)(app_1.app)
        .get('/api/users/currentuser')
        .send("")
        .expect(200);
    expect(response.body.currentUser).toBeNull();
}));
