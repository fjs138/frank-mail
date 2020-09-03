"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Table_1 = __importDefault(require("@material-ui/core/Table"));
const TableBody_1 = __importDefault(require("@material-ui/core/TableBody"));
const TableCell_1 = __importDefault(require("@material-ui/core/TableCell"));
const TableHead_1 = __importDefault(require("@material-ui/core/TableHead"));
const TableRow_1 = __importDefault(require("@material-ui/core/TableRow"));
const MessageList = ({ state }) => (react_1.default.createElement(Table_1.default, { stickyHeader: true, padding: "none" },
    react_1.default.createElement(TableHead_1.default, null,
        react_1.default.createElement(TableRow_1.default, null,
            react_1.default.createElement(TableCell_1.default, { style: { width: 120 } }, "Date"),
            react_1.default.createElement(TableCell_1.default, { style: { width: 300 } }, "From"),
            react_1.default.createElement(TableCell_1.default, null, "Subject"))),
    react_1.default.createElement(TableBody_1.default, null, state.messages.map((message) => (react_1.default.createElement(TableRow_1.default, { key: message.id, onClick: () => state.showMessage(message) },
        react_1.default.createElement(TableCell_1.default, null, new Date(message.date).toLocaleDateString()),
        react_1.default.createElement(TableCell_1.default, null, message.from),
        react_1.default.createElement(TableCell_1.default, null, message.subject)))))));
exports.default = MessageList;
//# sourceMappingURL=MessageList.js.map