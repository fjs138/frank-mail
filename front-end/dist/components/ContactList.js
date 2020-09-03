"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const List_1 = __importDefault(require("@material-ui/core/List"));
const ListItem_1 = __importDefault(require("@material-ui/core/ListItem"));
const ListItemAvatar_1 = __importDefault(require("@material-ui/core/ListItemAvatar"));
const Avatar_1 = __importDefault(require("@material-ui/core/Avatar"));
const Person_1 = __importDefault(require("@material-ui/icons/Person"));
const ListItemText_1 = __importDefault(require("@material-ui/core/ListItemText"));
const ContactList = ({ state }) => (react_1.default.createElement(List_1.default, null, state.contacts.map((value) => {
    return (react_1.default.createElement(ListItem_1.default, { key: value, button: true, onClick: () => state.showContact(value._id, value.name, value.email) },
        react_1.default.createElement(ListItemAvatar_1.default, null,
            react_1.default.createElement(Avatar_1.default, null,
                react_1.default.createElement(Person_1.default, null))),
        react_1.default.createElement(ListItemText_1.default, { primary: `${value.name}` })));
})));
exports.default = ContactList;
//# sourceMappingURL=ContactList.js.map