# Artist Guard System

This guard system ensures that users can only access and modify their own artists.

## Components Created:

### 1. **ArtistOwnerGuard** (`/src/artist/guards/artist-owner.guard.ts`)
- Validates that the current user owns the artist they're trying to access
- Throws `ForbiddenException` if user doesn't own the artist
- Throws `NotFoundException` if artist doesn't exist
- Attaches the artist to the request for controller use

### 2. **CurrentArtist Decorator** (`/src/artist/decorators/current-artist.decorator.ts`)
- Extracts the artist from the request (set by ArtistOwnerGuard)
- Provides type-safe access to the artist in controllers

### 3. **Updated Controller Methods**
- `PUT /artists/:id` - Update artist (protected by ArtistOwnerGuard)
- `DELETE /artists/:id` - Delete artist (protected by ArtistOwnerGuard)
- `GET /artists/my/artists` - Get current user's artists (protected by UserGuard)

### 4. **New Service Methods**
- `updateArtist()` - Update an existing artist
- `deleteArtist()` - Delete an artist
- `getArtistsByUserId()` - Get all artists for a specific user

## Usage Examples:

### Protected Endpoint (Only artist owner can access):
```typescript
@Put(':id')
@UseGuards(UserGuard, ArtistOwnerGuard)
async updateArtist(
  @Param('id') id: string,
  @Body() updateDto: UpdateArtistDto,
  @CurrentArtist() artist: Artist // Automatically injected
): Promise<ArtistResponseDto> {
  return await this.service.updateArtist(id, updateDto);
}
```

### API Endpoints:

1. **Create Artist** (User must be authenticated)
   ```
   POST /artists
   Headers: Authorization: Bearer <token>
   ```

2. **Get All Artists** (Public with optional auth)
   ```
   GET /artists
   ```

3. **Get Artist by ID** (Public)
   ```
   GET /artists/:id
   ```

4. **Update Artist** (Only owner can update)
   ```
   PUT /artists/:id
   Headers: Authorization: Bearer <token>
   ```

5. **Delete Artist** (Only owner can delete)
   ```
   DELETE /artists/:id
   Headers: Authorization: Bearer <token>
   ```

6. **Get My Artists** (User's own artists)
   ```
   GET /artists/my/artists
   Headers: Authorization: Bearer <token>
   ```

## Security Features:

- ✅ **Authentication Required**: User must be logged in
- ✅ **Authorization Check**: Only artist owner can modify
- ✅ **Resource Validation**: Checks if artist exists
- ✅ **Error Handling**: Proper error messages for different scenarios
- ✅ **Type Safety**: TypeScript decorators for request data

## Guard Chain:
```
UserGuard (checks authentication) → ArtistOwnerGuard (checks ownership) → Controller Method
```
