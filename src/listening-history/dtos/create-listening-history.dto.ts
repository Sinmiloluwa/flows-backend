import { IsNotEmpty, IsUUID, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateListeningHistoryDto {
  @IsNotEmpty()
  @IsUUID()
  songId: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  playbackPercentage?: number = 0; // Percentage of song played (0-100)

  @IsOptional()
  @IsNumber()
  @Min(0)
  duration?: number; // Duration listened in seconds
}
