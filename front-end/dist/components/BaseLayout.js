"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const davidhu2000_react_spinners_rise_loader_1 = __importDefault(require("@bit/davidhu2000.react-spinners.rise-loader"));
const Dialog_1 = __importDefault(require("@material-ui/core/Dialog"));
const DialogContent_1 = __importDefault(require("@material-ui/core/DialogContent"));
const DialogContentText_1 = __importDefault(require("@material-ui/core/DialogContentText"));
const DialogTitle_1 = __importDefault(require("@material-ui/core/DialogTitle"));
const Toolbar_1 = __importDefault(require("./Toolbar"));
const MailboxList_1 = __importDefault(require("./MailboxList"));
const MessageList_1 = __importDefault(require("./MessageList"));
const ContactList_1 = __importDefault(require("./ContactList"));
const WelcomeView_1 = __importDefault(require("./WelcomeView"));
const ContactView_1 = __importDefault(require("./ContactView"));
const MessageView_1 = __importDefault(require("./MessageView"));
const state_1 = require("../state");
class BaseLayout extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = state_1.createState(this);
    }
    render() {
        return (react_1.default.createElement("div", { className: "appContainer" },
            react_1.default.createElement(Dialog_1.default, { open: this.state.pleaseWaitVisible, disableBackdropClick: true, disableEscapeKeyDown: true, transitionDuration: 1 },
                react_1.default.createElement(DialogTitle_1.default, { style: { textAlign: "center" } }, "Please Wait"),
                react_1.default.createElement(DialogContent_1.default, null,
                    react_1.default.createElement(davidhu2000_react_spinners_rise_loader_1.default, { size: '15', color: 'purple', margin: "20px" }),
                    react_1.default.createElement(DialogContentText_1.default, { style: { textAlign: "center" } }, "Connecting..."))),
            react_1.default.createElement("div", { className: "toolbar" },
                react_1.default.createElement(Toolbar_1.default, { state: this.state })),
            react_1.default.createElement("div", { className: "mailboxList" },
                react_1.default.createElement(MailboxList_1.default, { state: this.state })),
            react_1.default.createElement("div", { className: "centerArea" },
                react_1.default.createElement("div", { className: "messageList" },
                    react_1.default.createElement(MessageList_1.default, { state: this.state })),
                react_1.default.createElement("div", { className: "centerViews" },
                    this.state.currentView === "welcome" && react_1.default.createElement(WelcomeView_1.default, null),
                    (this.state.currentView === "message" ||
                        this.state.currentView === "compose") && (react_1.default.createElement(MessageView_1.default, { state: this.state })),
                    (this.state.currentView === "contact" ||
                        this.state.currentView === "contactAdd") && (react_1.default.createElement(ContactView_1.default, { state: this.state })))),
            react_1.default.createElement("div", { className: "contactList" },
                react_1.default.createElement(ContactList_1.default, { state: this.state }))));
    }
}
exports.default = BaseLayout;
//# sourceMappingURL=BaseLayout.js.map