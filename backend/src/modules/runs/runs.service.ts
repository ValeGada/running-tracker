import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Run } from './entities/run.entity';
import { CreateRunDto } from './dto/create-run.dto';
import { UpdateRunDto } from './dto/update-run.dto';

@Injectable()
export class RunsService {
  constructor(
    @InjectRepository(Run)
    private runsRepository: Repository<Run>,
  ) {}

  async create(createRunDto: CreateRunDto, userId: string): Promise<Run> {
    const run = this.runsRepository.create({
      ...createRunDto,
      userId,
    });

    return this.runsRepository.save(run);
  }

  async findAll(): Promise<Run[]> {
    return this.runsRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<Run[]> {
    return this.runsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Run> {
    const run = await this.runsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!run) {
      throw new NotFoundException(`Run with ID ${id} not found`);
    }

    return run;
  }

  async update(id: string, updateRunDto: UpdateRunDto): Promise<Run> {
    await this.runsRepository.update(id, updateRunDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.runsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Run with ID ${id} not found`);
    }
  }

  async getUserStats(userId: string) {
    const runs = await this.findByUser(userId);
    
    if (runs.length === 0) {
      return {
        totalRuns: 0,
        totalDistance: 0,
        totalDuration: 0,
        averagePace: 0,
        totalCalories: 0,
      };
    }

    const totalDistance = runs.reduce((sum, run) => sum + run.distance, 0);
    const totalDuration = runs.reduce((sum, run) => sum + run.duration, 0);
    const totalCalories = runs.reduce((sum, run) => sum + run.calories, 0);
    const averagePace = runs.reduce((sum, run) => sum + run.averagePace, 0) / runs.length;

    return {
      totalRuns: runs.length,
      totalDistance: Math.round(totalDistance * 100) / 100,
      totalDuration,
      averagePace: Math.round(averagePace * 100) / 100,
      totalCalories,
    };
  }
}