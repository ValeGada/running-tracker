import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('runs')
export class Run {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, user => user.runs)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('datetime')
  startTime: Date;

  @Column('datetime')
  endTime: Date;

  @Column('decimal', { precision: 10, scale: 3 })
  distance: number; // in kilometers

  @Column('int')
  duration: number; // in seconds

  @Column('decimal', { precision: 5, scale: 2 })
  averagePace: number; // in minutes per kilometer

  @Column('decimal', { precision: 5, scale: 2 })
  maxSpeed: number; // in km/h

  @Column('int')
  calories: number;

  @Column('simple-json')
  route: Array<{
    latitude: number;
    longitude: number;
    timestamp: number;
    altitude?: number;
    accuracy?: number;
  }>;

  @Column({
    type: 'varchar',
    default: 'completed'
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}