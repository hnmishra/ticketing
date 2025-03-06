"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketCreatedPublisher = void 0;
const common_1 = require("@hnticketing/common");
class TicketCreatedPublisher extends common_1.Publisher {
    constructor() {
        super(...arguments);
        this.subject = common_1.Subjects.TicketCreated;
    }
}
exports.TicketCreatedPublisher = TicketCreatedPublisher;
;
