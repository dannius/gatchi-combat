import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface FighterDTO {
  userId: string;
  name: string;
  scores: number;
  fights: number;
  wins: number;
  looses: number;
  bdMode: boolean;
}

@Schema()
export class FightersTable implements FighterDTO {
  @Prop()
  userId: string;

  @Prop()
  name: string;

  @Prop()
  scores: number;

  @Prop()
  fights: number;

  @Prop()
  wins: number;

  @Prop()
  looses: number;

  @Prop()
  bdMode: boolean;
}

export const FighterSchema = SchemaFactory.createForClass(FightersTable);
