import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group, GroupDTO } from './schemas/group.schema';

@Injectable()
export class GroupService {
  constructor(@InjectModel(Group.name) private fighterModel: Model<Group>) {}

  async create(fighterDto: GroupDTO): Promise<GroupDTO> {
    const createFighter = new this.fighterModel(fighterDto);

    return createFighter.save();
  }

  async get(groupId: number): Promise<GroupDTO> {
    return this.fighterModel.findOne({ groupId }).exec();
  }

  async findAll(): Promise<GroupDTO[]> {
    return this.fighterModel.find().exec();
  }

  async update(group: Group): Promise<Group> {
    return this.fighterModel.findOneAndUpdate({ groupId: group.groupId }, group, { new: true });
  }
}
