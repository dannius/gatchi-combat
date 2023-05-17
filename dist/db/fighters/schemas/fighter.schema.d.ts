/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
export interface FighterDTO {
    userId: string;
    name: string;
    scores: number;
    fights: number;
    wins: number;
    looses: number;
}
export declare class FightersTable implements FighterDTO {
    userId: string;
    name: string;
    scores: number;
    fights: number;
    wins: number;
    looses: number;
}
export declare const FighterSchema: import("mongoose").Schema<FightersTable, import("mongoose").Model<FightersTable, any, any, any, import("mongoose").Document<unknown, any, FightersTable> & Omit<FightersTable & {
    _id: import("mongoose").Types.ObjectId;
}, never>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, FightersTable, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<FightersTable>> & Omit<import("mongoose").FlatRecord<FightersTable> & {
    _id: import("mongoose").Types.ObjectId;
}, never>>;
