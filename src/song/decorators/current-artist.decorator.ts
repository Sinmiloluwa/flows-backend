import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Artist } from '../../artist/entities/artist.entity';

export const CurrentArtist = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Artist => {
    const request = ctx.switchToHttp().getRequest();
    return request.artist;
  },
);
