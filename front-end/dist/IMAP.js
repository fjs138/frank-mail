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
exports.Worker = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
class Worker {
    listMailboxes() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("IMAP.Worker.listMailboxes()");
            const response = yield axios_1.default.get(`${config_1.config.serverAddress}/mailboxes`);
            return response.data;
        });
    }
    listMessages(inMailbox) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("IMAP.Worker.listMessages()");
            const response = yield axios_1.default.get(`${config_1.config.serverAddress}/mailboxes/${inMailbox}`);
            return response.data;
        });
    }
    getMessageBody(inID, inMailbox) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("IMAP.Worker.getMessageBody()", inID);
            const response = yield axios_1.default.get(`${config_1.config.serverAddress}/messages/${inMailbox}/${inID}`);
            return response.data;
        });
    }
    deleteMessage(inID, inMailbox) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("IMAP.Worker.getMessageBody()", inID);
            yield axios_1.default.delete(`${config_1.config.serverAddress}/messages/${inMailbox}/${inID}`);
        });
    }
}
exports.Worker = Worker;
//# sourceMappingURL=IMAP.js.map