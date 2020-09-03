"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const ContactMail_1 = __importDefault(require("@material-ui/icons/ContactMail"));
const Email_1 = __importDefault(require("@material-ui/icons/Email"));
const Toolbar = ({ state }) => (react_1.default.createElement("div", null,
    react_1.default.createElement(Button_1.default, { variant: "contained", color: "primary", size: "small", style: { marginRight: 10 }, onClick: () => state.showComposeMessage("new") },
        react_1.default.createElement(Email_1.default, { style: { marginRight: 10 } }),
        "New Message"),
    react_1.default.createElement(Button_1.default, { variant: "contained", color: "secondary", size: "small", style: { marginRight: 10 }, onClick: state.showAddContact },
        react_1.default.createElement(ContactMail_1.default, { style: { marginRight: 10 } }),
        "New Contact")));
exports.default = Toolbar;
//# sourceMappingURL=Toolbar.js.map