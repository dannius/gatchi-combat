import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Fighter, FighterDTO } from './schemas/fighter.schema';

@Injectable()
export class FighterService {
  constructor(@InjectModel(Fighter.name) private fighterModel: Model<Fighter>) {}

  async create(fighterDto: FighterDTO): Promise<FighterDTO> {
    const createFighter = new this.fighterModel(fighterDto);

    return createFighter.save();
  }

  async get(userId: number): Promise<FighterDTO> {
    return this.fighterModel.findOne({ userId }).exec();
  }

  async findAll(): Promise<FighterDTO[]> {
    return this.fighterModel.find().exec();
  }
}
