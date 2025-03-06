"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpirationCompletePublisher = void 0;
const common_1 = require("@hnticketing/common");
class ExpirationCompletePublisher extends common_1.Publisher {
    constructor() {
        super(...arguments);
        this.subject = common_1.Subjects.ExpirationComplete;
    }
}
exports.ExpirationCompletePublisher = ExpirationCompletePublisher;
