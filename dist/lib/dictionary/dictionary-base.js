"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DictionaryBase = void 0;
const random_1 = require("../util/random");
const dictionary_messages_1 = require("./dictionary-messages");
class DictionaryBase {
    medias = [];
    messagesHeader = [];
    messagesBody = [];
    specialMessagesBody = { lose: [], win: [] };
    constructor({ messagesBody, messagesHeader, medias, specialMessagesBody }) {
        if (messagesBody) {
            this.messagesBody = messagesBody;
        }
        if (messagesHeader) {
            this.messagesHeader = messagesHeader;
        }
        if (specialMessagesBody) {
            this.specialMessagesBody = specialMessagesBody;
        }
        if (medias) {
            this.medias = medias;
        }
    }
    getMedia() {
        return this.medias[(0, random_1.random)(0, this.medias.length - 1)];
    }
    getMessage(params) {
        let message;
        if (params.fightResultType && (params.fightResultType === 'luckyLose' || params.fightResultType === 'luckyWin')) {
            if (params.fightResultType === 'luckyLose') {
                const bodyIndex = (0, random_1.random)(0, this.specialMessagesBody.lose.length - 1);
                message = this.specialMessagesBody.lose[bodyIndex];
            }
            else {
                const bodyIndex = (0, random_1.random)(0, this.specialMessagesBody.win.length - 1);
                message = this.specialMessagesBody.win[bodyIndex];
            }
        }
        else {
            const bodyIndex = (0, random_1.random)(0, this.messagesBody.length - 1);
            message = this.messagesBody[bodyIndex];
        }
        let header = '';
        if (this.messagesHeader.length) {
            const headerIndex = (0, random_1.random)(0, this.messagesHeader.length - 1);
            const headerMessage = this.messagesHeader[headerIndex];
            header = this.replaceMessageVars(params, headerMessage);
        }
        const body = this.replaceMessageVars(params, message);
        return `${header}${body}`;
    }
    replaceMessageVars(params, msg) {
        return Object.entries(params).reduce((msg, [textKey, textVal]) => msg.replaceAll(dictionary_messages_1.TextKeys[textKey], textVal), msg);
    }
}
exports.DictionaryBase = DictionaryBase;
//# sourceMappingURL=dictionary-base.js.map