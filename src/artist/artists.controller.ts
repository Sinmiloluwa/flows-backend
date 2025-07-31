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
  UseGuards 
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto, ArtistResponseDto } from './dtos';
import { UserGuard, OptionalUserGuard } from '../guards';
import { CurrentUser } from '../decorators/current-user.decorator';

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

}
