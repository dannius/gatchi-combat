import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export interface FighterDTO {
  userId: number;
  name: string;
  scores: number;
  fights: number;
  wins: number;
  looses: number;
}

export type FighterDocument = HydratedDocument<Fighter>;

@Schema()
export class Fighter {
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
