import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group, GroupDTO } from './schemas/group.schema';

@Injectable()
export class GroupService {
  constructor(@InjectModel(Group.name) private groupModel: Model<Group>) {}

  async create(groupDto: GroupDTO): Promise<GroupDTO> {
    const createFighter = new this.groupModel(groupDto);

    return createFighter.save();
  }

  async get(groupId: number): Promise<GroupDTO> {
    return this.groupModel.findOne({ groupId }).exec();
  }

  async findAll(): Promise<GroupDTO[]> {
    return this.groupModel.find().exec();
  }

  async update(group: Group): Promise<Group> {
    return this.groupModel.findOneAndUpdate({ groupId: group.groupId }, group, { new: true });
  }
}
