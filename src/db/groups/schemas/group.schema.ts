import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export interface GroupDTO {
  groupId: number;
  name: string;
  users: string[];
}

export type GroupDocument = HydratedDocument<Group>;

@Schema()
export class Group {
  @Prop()
  groupId: number;

  @Prop()
  name: string;

  @Prop()
  users: string[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);
