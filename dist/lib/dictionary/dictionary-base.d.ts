import { DictionaryBaseParams, ISpecialMessagesBody, Media, TextKeys } from './dictionary-messages';
type MessageDataset = {
    [P in keyof typeof TextKeys]: string;
};
export declare class DictionaryBase {
    medias: Media[];
    protected messagesHeader: any[];
    protected messagesBody: string[];
    protected specialMessagesBody: ISpecialMessagesBody;
    constructor({ messagesBody, messagesHeader, medias, specialMessagesBody }: DictionaryBaseParams);
    getMedia(): Media;
    getMessage(params: Partial<MessageDataset>): string;
    private replaceMessageVars;
}
export {};
