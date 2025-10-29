import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RunsService } from './runs.service';
import { CreateRunDto } from './dto/create-run.dto';
import { UpdateRunDto } from './dto/update-run.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Run } from './entities/run.entity';

@ApiTags('runs')
@Controller('runs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RunsController {
  constructor(private readonly runsService: RunsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new run' })
  @ApiResponse({ status: 201, description: 'Run created successfully', type: Run })
  async create(@Body() createRunDto: CreateRunDto, @Request() req): Promise<Run> {
    return this.runsService.create(createRunDto, req.user.userId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get runs by user ID' })
  @ApiResponse({ status: 200, description: 'User runs retrieved successfully', type: [Run] })
  async findByUser(@Param('userId') userId: string): Promise<Run[]> {
    return this.runsService.findByUser(userId);
  }

  @Get('my-runs')
  @ApiOperation({ summary: 'Get current user runs' })
  @ApiResponse({ status: 200, description: 'Current user runs retrieved successfully', type: [Run] })
  async getMyRuns(@Request() req): Promise<Run[]> {
    return this.runsService.findByUser(req.user.userId);
  }

  @Get('stats/me')
  @ApiOperation({ summary: 'Get current user statistics' })
  @ApiResponse({ status: 200, description: 'User statistics retrieved successfully' })
  async getMyStats(@Request() req) {
    return this.runsService.getUserStats(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get run by ID' })
  @ApiResponse({ status: 200, description: 'Run found successfully', type: Run })
  @ApiResponse({ status: 404, description: 'Run not found' })
  async findOne(@Param('id') id: string): Promise<Run> {
    return this.runsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update run by ID' })
  @ApiResponse({ status: 200, description: 'Run updated successfully', type: Run })
  @ApiResponse({ status: 404, description: 'Run not found' })
  async update(@Param('id') id: string, @Body() updateRunDto: UpdateRunDto): Promise<Run> {
    return this.runsService.update(id, updateRunDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete run by ID' })
  @ApiResponse({ status: 200, description: 'Run deleted successfully' })
  @ApiResponse({ status: 404, description: 'Run not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.runsService.remove(id);
  }
}