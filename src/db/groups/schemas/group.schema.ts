import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface GroupDTO {
  groupId: number;
  allowDailyQuote: boolean;
  fighters: Map<string, { name: string; scores: number }>;
}

@Schema()
export class GroupsTable implements GroupDTO {
  @Prop()
  groupId: number;

  @Prop()
  fighters: Map<string, { name: string; scores: number }>;

  @Prop()
  allowDailyQuote: boolean;
}

export const GroupSchema = SchemaFactory.createForClass(GroupsTable);
