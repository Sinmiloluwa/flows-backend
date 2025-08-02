import { 
  Controller, 
  Inject, 
  Post, 
  Body, 
  ValidationPipe, 
  HttpStatus, 
  HttpCode, 
  Get, 
  Param, 
  NotFoundException,
  UseGuards,
  Put,
  Delete
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto, UpdateArtistDto, ArtistResponseDto } from './dtos';
import { UserGuard, OptionalUserGuard } from '../guards';
import { CurrentUser } from '../decorators/current-user.decorator';
import { ArtistOwnerGuard } from './guards/artist-owner.guard';
import { CurrentArtist } from './decorators/current-artist.decorator';

@Controller('artists')
export class ArtistsController {
    constructor(
        @Inject() private readonly artistService: ArtistsService
    ) {}
    
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(UserGuard)
    async registerArtist(
        @Body(ValidationPipe) createArtistDto: CreateArtistDto,
        @CurrentUser() user: any
    ): Promise<ArtistResponseDto> {
        return await this.artistService.registerArtist(createArtistDto, user.sub);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @UseGuards(OptionalUserGuard) // Works for both authenticated and non-authenticated users
    async getAllArtists(@CurrentUser() user: any): Promise<ArtistResponseDto[]> {
        if (user) {
            console.log(`Artists fetched by authenticated user: ${user}`);
        } else {
            console.log('Artists fetched by anonymous user');
        }
        return await this.artistService.getAllArtists();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    // No guard - completely public endpoint
    async getArtistById(@Param('id') id: string): Promise<ArtistResponseDto> {
        const artist = await this.artistService.getArtistById(id);
        if (!artist) {
            throw new NotFoundException(`Artist with ID ${id} not found`);
        }
        return artist;
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(UserGuard, ArtistOwnerGuard)
    async updateArtist(
        @Param('id') id: string,
        @Body(ValidationPipe) updateArtistDto: UpdateArtistDto,
        @CurrentArtist() artist: any
    ): Promise<ArtistResponseDto> {
        return await this.artistService.updateArtist(id, updateArtistDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(UserGuard, ArtistOwnerGuard)
    async deleteArtist(
        @Param('id') id: string,
        @CurrentArtist() artist: any
    ): Promise<{ message: string }> {
        await this.artistService.deleteArtist(id);
        return { message: 'Artist deleted successfully' };
    }

    @Get('my/artists')
    @HttpCode(HttpStatus.OK)
    @UseGuards(UserGuard)
    async getMyArtists(@CurrentUser() user: any): Promise<ArtistResponseDto[]> {
        return await this.artistService.getArtistsByUserId(user.sub);
    }

}
