import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RunsService } from './runs.service';
import { RunsController } from './runs.controller';
import { Run } from './entities/run.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Run])],
  controllers: [RunsController],
  providers: [RunsService],
})
export class RunsModule {}