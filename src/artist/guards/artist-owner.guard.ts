import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Artist } from '../entities/artist.entity';

@Injectable()
export class ArtistOwnerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const artistId = request.params.id;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!artistId) {
      throw new ForbiddenException('Artist ID is required');
    }

    // Find the artist and check ownership
    const artist = await Artist.findByPk(artistId);
    
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    // Check if the current user owns this artist
    if (artist.userId !== user.id) {
      throw new ForbiddenException('You can only access your own artists');
    }

    // Attach artist to request for use in controller
    request.artist = artist;
    
    return true;
  }
}
