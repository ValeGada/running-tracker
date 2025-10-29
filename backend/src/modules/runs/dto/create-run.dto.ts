import { IsDateString, IsNumber, IsArray, IsEnum, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRunDto {
  @ApiProperty({ example: '2024-01-15T10:00:00Z' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  @IsDateString()
  endTime: string;

  @ApiProperty({ example: 5.2, description: 'Distance in kilometers' })
  @IsNumber()
  @Min(0)
  distance: number;

  @ApiProperty({ example: 1800, description: 'Duration in seconds' })
  @IsNumber()
  @Min(0)
  duration: number;

  @ApiProperty({ example: 5.5, description: 'Average pace in minutes per kilometer' })
  @IsNumber()
  @Min(0)
  averagePace: number;

  @ApiProperty({ example: 12.5, description: 'Maximum speed in km/h' })
  @IsNumber()
  @Min(0)
  maxSpeed: number;

  @ApiProperty({ example: 350, description: 'Calories burned' })
  @IsNumber()
  @Min(0)
  calories: number;

  @ApiProperty({
    example: [
      {
        latitude: 40.7128,
        longitude: -74.0060,
        timestamp: 1642248000000,
        altitude: 10,
        accuracy: 5
      }
    ],
    description: 'GPS route coordinates'
  })
  @IsArray()
  route: Array<{
    latitude: number;
    longitude: number;
    timestamp: number;
    altitude?: number;
    accuracy?: number;
  }>;

  @ApiProperty({ enum: ['active', 'paused', 'completed'], default: 'completed' })
  @IsOptional()
  @IsEnum(['active', 'paused', 'completed'])
  status?: string;
}