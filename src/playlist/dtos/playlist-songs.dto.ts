import { IsNotEmpty, IsUUID, IsArray } from 'class-validator';

export class AddSongsToPlaylistDto {
  @IsNotEmpty()
  @IsArray()
  @IsUUID(undefined, { each: true })
  songIds: string[];
}

export class RemoveSongsFromPlaylistDto {
  @IsNotEmpty()
  @IsArray()
  @IsUUID(undefined, { each: true })
  songIds: string[];
}
