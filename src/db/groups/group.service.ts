import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GroupsTable, GroupDTO } from './schemas/group.schema';

@Injectable()
export class GroupService {
  constructor(@InjectModel(GroupsTable.name) private groupModel: Model<GroupsTable>) {}

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

  async findDailyQuotesGroups(): Promise<GroupDTO[]> {
    return this.groupModel.find({ allowDailyQuote: true }).exec();
  }

  async update(group: GroupsTable): Promise<GroupsTable> {
    return this.groupModel.findOneAndUpdate({ groupId: group.groupId }, group, { new: true });
  }
}
