import { IsNotEmpty, IsUUID } from 'class-validator';


export class CreateRecentlyPlayedDto {
  @IsNotEmpty()
  @IsUUID()
  songId: string;
}
