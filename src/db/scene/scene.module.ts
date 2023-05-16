import { SceneService } from './scene.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScenesTable, SceneSchema } from './schemas/scene.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ScenesTable.name, schema: SceneSchema }])],
  providers: [SceneService],
  exports: [SceneService],
})
export class ScenesModule {}
