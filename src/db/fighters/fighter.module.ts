import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FighterService } from './fighter.service';
import { Fighter, FighterSchema } from './schemas/fighter.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Fighter.name, schema: FighterSchema }])],
  providers: [FighterService],
  exports: [FighterService],
})
export class FightersModule {}
