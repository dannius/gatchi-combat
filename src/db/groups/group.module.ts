import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupService } from './group.service';
import { Group, GroupSchema } from './schemas/group.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }])],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupsModule {}
