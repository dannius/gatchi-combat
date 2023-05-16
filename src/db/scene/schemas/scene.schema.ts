import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { WeaponType } from 'src/lib';

export interface SceneDTO {
  winnerId: string;
  looserId: string;
  winnerWeapon: WeaponType;
  looserWeapon: WeaponType;
}

@Schema()
export class ScenesTable implements SceneDTO {
  @Prop()
  winnerId: string;

  @Prop()
  looserId: string;

  @Prop()
  winnerWeapon: WeaponType;

  @Prop()
  looserWeapon: WeaponType;
}

export const SceneSchema = SchemaFactory.createForClass(ScenesTable);
