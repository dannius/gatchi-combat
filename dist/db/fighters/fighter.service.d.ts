import { Model } from 'mongoose';
import { FightersTable, FighterDTO } from './schemas/fighter.schema';
export declare class FighterService {
    private fighterModel;
    constructor(fighterModel: Model<FightersTable>);
    create(fighterDto: FighterDTO): Promise<FighterDTO>;
    get(params: {
        userId?: string;
        name?: string;
    }): Promise<FighterDTO>;
    findAllWithLimit(limit?: number): Promise<FighterDTO[]>;
    update(fighter: FightersTable): Promise<FightersTable>;
    remove(fighter: FightersTable): Promise<FightersTable>;
}
