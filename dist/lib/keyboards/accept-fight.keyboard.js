"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAcceptFightReplyMarkup = void 0;
const dictionary_messages_1 = require("../dictionary/dictionary-messages");
const types_1 = require("../types");
function getAcceptFightReplyMarkup(sceneId) {
    return {
        inline_keyboard: [
            [
                {
                    text: dictionary_messages_1.DictionaryActionTitles.acceptFight,
                    callback_data: `${types_1.ActionType.AcceptFight}~${sceneId}`,
                },
            ],
        ],
    };
}
exports.getAcceptFightReplyMarkup = getAcceptFightReplyMarkup;
//# sourceMappingURL=accept-fight.keyboard.js.map