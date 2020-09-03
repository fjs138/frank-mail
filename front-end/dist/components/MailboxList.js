"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Chip_1 = __importDefault(require("@material-ui/core/Chip"));
const List_1 = __importDefault(require("@material-ui/core/List"));
const MailboxList = ({ state }) => (react_1.default.createElement(List_1.default, null, state.mailboxes.map((value) => {
    return (react_1.default.createElement(Chip_1.default, { label: `${value.name}`, onClick: () => state.setCurrentMailbox(value.path), style: { width: 128, marginBottom: 10 }, color: state.currentMailbox === value.path ? "secondary" : "primary" }));
})));
exports.default = MailboxList;
//# sourceMappingURL=MailboxList.js.map