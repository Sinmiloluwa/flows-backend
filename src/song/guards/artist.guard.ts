import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Artist } from '../../artist/entities/artist.entity';

@Injectable()
export class ArtistGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Use user.sub (from JWT payload) instead of user.id
    const userId = user.sub || user.id;
    
    if (!userId) {
      throw new ForbiddenException('Invalid user token');
    }

    // Check if the user has an artist profile
    const artist = await Artist.findOne({
      where: { userId: userId }
    });

    if (!artist) {
      throw new ForbiddenException('Only artists can create songs. Please create an artist profile first.');
    }

    // Attach the artist to the request for use in controller
    request.artist = artist;
    
    return true;
  }
}
