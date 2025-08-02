import { Inject, Injectable } from '@nestjs/common';
import { Artist } from './entities/artist.entity';
import { CreateArtistDto, UpdateArtistDto, ArtistResponseDto } from './dtos';

@Injectable()
export class ArtistsService {
    constructor(
        @Inject('ARTIST_REPOSITORY') private readonly artistModel: typeof Artist
    ) {}

    async registerArtist(createArtistDto: CreateArtistDto, userId: string): Promise<ArtistResponseDto> {
        try {
            const artist = await this.artistModel.create({ ...createArtistDto, userId });
            
            return {
                id: artist.id,
                name: artist.name,
                bio: artist.bio,
                imageUrl: artist.profilePicture,
                genre: artist.genre,
                country: artist.country,
                recordLabel: artist.recordLabel,
                createdAt: artist.createdAt,
                updatedAt: artist.updatedAt
            };
        } catch (error) {
            throw new Error(`Failed to register artist: ${error.message}`);
        }
    }

    async getAllArtists(): Promise<ArtistResponseDto[]> {
        try {
            const artists = await this.artistModel.findAll();
            return artists.map(artist => ({
                id: artist.id,
                name: artist.name,
                bio: artist.bio,
                imageUrl: artist.profilePicture,
                genre: artist.genre,
                country: artist.country,
                recordLabel: artist.recordLabel,
                createdAt: artist.createdAt,
                updatedAt: artist.updatedAt
            }));
        } catch (error) {
            throw new Error(`Failed to retrieve artists: ${error.message}`);
        }
    }

    async getArtistById(id: string): Promise<ArtistResponseDto | null> {
        try {
            const artist = await this.artistModel.findByPk(id);
            if (!artist) {
                return null;
            }
            return {
                id: artist.id,
                name: artist.name,
                bio: artist.bio,
                imageUrl: artist.profilePicture,
                genre: artist.genre,
                country: artist.country,
                recordLabel: artist.recordLabel,
                createdAt: artist.createdAt,
                updatedAt: artist.updatedAt
            };
        } catch (error) {
            throw new Error(`Failed to retrieve artist by ID ${id}: ${error.message}`);
        }
    }

    async updateArtist(id: string, updateArtistDto: UpdateArtistDto): Promise<ArtistResponseDto> {
        try {
            const artist = await this.artistModel.findByPk(id);
            if (!artist) {
                throw new Error('Artist not found');
            }

            await artist.update(updateArtistDto);
            
            return {
                id: artist.id,
                name: artist.name,
                bio: artist.bio,
                imageUrl: artist.profilePicture,
                genre: artist.genre,
                country: artist.country,
                recordLabel: artist.recordLabel,
                createdAt: artist.createdAt,
                updatedAt: artist.updatedAt
            };
        } catch (error) {
            throw new Error(`Failed to update artist: ${error.message}`);
        }
    }

    async deleteArtist(id: string): Promise<void> {
        try {
            const artist = await this.artistModel.findByPk(id);
            if (!artist) {
                throw new Error('Artist not found');
            }

            await artist.destroy();
        } catch (error) {
            throw new Error(`Failed to delete artist: ${error.message}`);
        }
    }

    async getArtistsByUserId(userId: string): Promise<ArtistResponseDto[]> {
        try {
            const artists = await this.artistModel.findAll({
                where: { userId }
            });

            return artists.map(artist => ({
                id: artist.id,
                name: artist.name,
                bio: artist.bio,
                imageUrl: artist.profilePicture,
                genre: artist.genre,
                country: artist.country,
                recordLabel: artist.recordLabel,
                createdAt: artist.createdAt,
                updatedAt: artist.updatedAt
            }));
        } catch (error) {
            throw new Error(`Failed to retrieve artists for user ${userId}: ${error.message}`);
        }
    }
}
