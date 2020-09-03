"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const core_1 = require("@material-ui/core");
const core_2 = require("@material-ui/core");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const MessageView = ({ state }) => (react_1.default.createElement("form", null,
    state.currentView === "message" && (react_1.default.createElement(core_1.InputBase, { defaultValue: `ID ${state.messageID}`, margin: "dense", disabled: true, fullWidth: true, className: "messageInfoField" })),
    state.currentView === "message" && react_1.default.createElement("br", null),
    state.currentView === "message" && (react_1.default.createElement(core_1.InputBase, { defaultValue: state.messageDate, margin: "dense", disabled: true, fullWidth: true, className: "messageInfoField" })),
    state.currentView === "message" && react_1.default.createElement("br", null),
    state.currentView === "message" && (react_1.default.createElement(core_2.TextField, { margin: "dense", variant: "outlined", fullWidth: true, label: "From", value: state.messageFrom, disabled: true, InputProps: { style: { color: "#000000" } } })),
    state.currentView === "message" && react_1.default.createElement("br", null),
    state.currentView === "compose" && (react_1.default.createElement(core_2.TextField, { margin: "dense", id: "messageTo", variant: "outlined", fullWidth: true, label: "To", value: state.messageTo, InputProps: { style: { color: "#000000" } }, onChange: state.fieldChangeHandler })),
    state.currentView === "compose" && react_1.default.createElement("br", null),
    react_1.default.createElement(core_2.TextField, { margin: "dense", id: "messageSubject", label: "Subject", variant: "outlined", fullWidth: true, value: state.messageSubject, disabled: state.currentView === "message", InputProps: { style: { color: "#000000" } }, onChange: state.fieldChangeHandler }),
    react_1.default.createElement("br", null),
    react_1.default.createElement(core_2.TextField, { margin: "dense", id: "messageBody", variant: "outlined", fullWidth: true, multiline: true, rows: 12, value: state.messageBody, disabled: state.currentView === "message", InputProps: { style: { color: "#000000" } }, onChange: state.fieldChangeHandler }),
    state.currentView === "compose" && (react_1.default.createElement(Button_1.default, { variant: "contained", color: "primary", size: "small", style: { marginTop: 10 }, onClick: state.sendMessage }, "Send")),
    state.currentView === "message" && (react_1.default.createElement(Button_1.default, { variant: "contained", color: "primary", size: "small", style: { marginTop: 10, marginRight: 10 }, onClick: () => state.showComposeMessage("reply") }, "Reply")),
    state.currentView === "message" && (react_1.default.createElement(Button_1.default, { variant: "contained", color: "primary", size: "small", style: { marginTop: 10 }, onClick: state.deleteMessage }, "Delete"))));
exports.default = MessageView;
//# sourceMappingURL=MessageView.js.map