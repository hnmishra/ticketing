"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderCancelledPublisher = void 0;
const common_1 = require("@hnticketing/common");
class OrderCancelledPublisher extends common_1.Publisher {
    constructor() {
        super(...arguments);
        this.subject = common_1.Subjects.OrderCancelled;
    }
}
exports.OrderCancelledPublisher = OrderCancelledPublisher;
;
