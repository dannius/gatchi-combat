"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dictionary = void 0;
const dictionary_base_1 = require("./dictionary-base");
const dictionary_messages_1 = require("./dictionary-messages");
exports.Dictionary = Object.entries(dictionary_messages_1.DictionaryMessages).reduce((acc, [key, val]) => {
    acc[key] = new dictionary_base_1.DictionaryBase(val);
    return acc;
}, {});
//# sourceMappingURL=dictionary.js.map