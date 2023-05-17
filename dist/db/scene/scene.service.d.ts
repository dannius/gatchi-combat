import { Model } from 'mongoose';
import { SceneDTO, ScenesTable } from './schemas/scene.schema';
export declare class SceneService {
    private scemeModel;
    constructor(scemeModel: Model<ScenesTable>);
    create(sceneDto: SceneDTO): Promise<SceneDTO>;
}
