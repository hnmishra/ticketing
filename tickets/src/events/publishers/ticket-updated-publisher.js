"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketUpdatedPublisher = void 0;
const common_1 = require("@hnticketing/common");
class TicketUpdatedPublisher extends common_1.Publisher {
    constructor() {
        super(...arguments);
        this.subject = common_1.Subjects.TicketUpdated;
    }
}
exports.TicketUpdatedPublisher = TicketUpdatedPublisher;
;
