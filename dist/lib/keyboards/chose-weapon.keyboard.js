"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChoseWeaponReplyMarkup = void 0;
const dictionary_messages_1 = require("../dictionary/dictionary-messages");
const types_1 = require("../types");
function getChoseWeaponReplyMarkup(sceneId) {
    return {
        inline_keyboard: [
            [
                {
                    text: dictionary_messages_1.DictionaryActionTitles[types_1.WeaponType.Rock],
                    callback_data: `${types_1.WeaponType.Rock}~${sceneId}`,
                },
                {
                    text: dictionary_messages_1.DictionaryActionTitles[types_1.WeaponType.Scissors],
                    callback_data: `${types_1.WeaponType.Scissors}~${sceneId}`,
                },
                {
                    text: dictionary_messages_1.DictionaryActionTitles[types_1.WeaponType.Paper],
                    callback_data: `${types_1.WeaponType.Paper}~${sceneId}`,
                },
            ],
        ],
    };
}
exports.getChoseWeaponReplyMarkup = getChoseWeaponReplyMarkup;
//# sourceMappingURL=chose-weapon.keyboard.js.map