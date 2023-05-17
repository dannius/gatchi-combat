import { DictionaryBaseParams, Media, TextKeys } from './dictionary-messages';
type MessageDataset = {
    [P in keyof typeof TextKeys]: string;
};
export declare class DictionaryBase {
    medias: Media[];
    protected messagesHeader: any[];
    protected messagesBody: string[];
    constructor({ messagesBody, messagesHeader, medias }: DictionaryBaseParams);
    getMedia(): Media;
    getMessage(params: Partial<MessageDataset>): string;
    private replaceMessageVars;
}
export {};
