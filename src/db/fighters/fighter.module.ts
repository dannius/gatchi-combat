import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FighterService } from './fighter.service';
import { FightersTable, FighterSchema } from './schemas/fighter.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: FightersTable.name, schema: FighterSchema }])],
  providers: [FighterService],
  exports: [FighterService],
})
export class FightersModule {}
