import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SceneDTO, ScenesTable } from './schemas/scene.schema';

@Injectable()
export class SceneService {
  constructor(@InjectModel(ScenesTable.name) private scemeModel: Model<ScenesTable>) {}

  async create(sceneDto: SceneDTO): Promise<SceneDTO> {
    const createFighter = new this.scemeModel(sceneDto);

    return createFighter.save();
  }
}
