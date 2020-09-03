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
    listContacts() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Contacts.Worker.listContacts()");
            const response = yield axios_1.default.get(`${config_1.config.serverAddress}/contacts`);
            return response.data;
        });
    }
    addContact(inContact) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Contacts.Worker.addContact()", inContact);
            const response = yield axios_1.default.post(`${config_1.config.serverAddress}/contacts`, inContact);
            return response.data;
        });
    }
    deleteContact(inID) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Contacts.Worker.deleteContact()", inID);
            yield axios_1.default.delete(`${config_1.config.serverAddress}/contacts/${inID}`);
        });
    }
}
exports.Worker = Worker;
//# sourceMappingURL=Contacts.js.map