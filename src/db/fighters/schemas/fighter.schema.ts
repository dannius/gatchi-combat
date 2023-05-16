import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface FighterDTO {
  userId: number;
  name: string;
  scores: number;
  fights: number;
  wins: number;
  looses: number;
}

@Schema()
export class Fighter implements FighterDTO {
  @Prop()
  userId: number;

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
}

export const FighterSchema = SchemaFactory.createForClass(Fighter);
