import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface GroupDTO {
  groupId: number;
  name: string;
  fighters: { userId: number; scores: number }[];
}

@Schema()
export class Group implements GroupDTO {
  @Prop()
  groupId: number;

  @Prop()
  name: string;

  @Prop()
  fighters: { userId: number; scores: number }[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);
