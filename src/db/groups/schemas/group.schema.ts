import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface GroupDTO {
  groupId: number;
  allowDailyQuote: boolean;
  fighters: Map<string, { username: string; scores: number; name: string }>;
}

@Schema()
export class GroupsTable implements GroupDTO {
  @Prop()
  groupId: number;

  @Prop()
  fighters: Map<string, { username: string; scores: number; name: string }>;

  @Prop()
  allowDailyQuote: boolean;
}

export const GroupSchema = SchemaFactory.createForClass(GroupsTable);
