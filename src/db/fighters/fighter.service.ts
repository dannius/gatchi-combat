import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FightersTable, FighterDTO } from './schemas/fighter.schema';

@Injectable()
export class FighterService {
  constructor(@InjectModel(FightersTable.name) private fighterModel: Model<FightersTable>) {}

  async create(fighterDto: FighterDTO): Promise<FighterDTO> {
    const createFighter = new this.fighterModel(fighterDto);

    return createFighter.save();
  }

  async get(params: { userId?: string; username?: string; name?: string }): Promise<FighterDTO> {
    return this.fighterModel.findOne(params).exec();
  }

  async findAllWithLimit(limit = 100): Promise<FighterDTO[]> {
    return this.fighterModel.find().sort({ scores: -1 }).limit(limit).exec();
  }

  async update(fighter: FightersTable): Promise<FightersTable> {
    return this.fighterModel.findOneAndUpdate({ userId: fighter.userId }, fighter, { new: true });
  }

  async remove(fighter: FightersTable): Promise<FightersTable> {
    return this.fighterModel.findOneAndRemove({ userId: fighter.userId });
  }
}
