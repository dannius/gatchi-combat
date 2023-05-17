import { Model } from 'mongoose';
import { GroupsTable, GroupDTO } from './schemas/group.schema';
export declare class GroupService {
    private groupModel;
    constructor(groupModel: Model<GroupsTable>);
    create(groupDto: GroupDTO): Promise<GroupDTO>;
    get(groupId: number): Promise<GroupDTO>;
    findAll(): Promise<GroupDTO[]>;
    findDailyQuotesGroups(): Promise<GroupDTO[]>;
    update(group: GroupsTable): Promise<GroupsTable>;
}
