# Music Streaming Backend API

A comprehensive NestJS-based backend for a music streaming platform with advanced features including authentication, artist management, song uploads, playlists, and popularity tracking.

## 🚀 Features

### Core Features
- **User Authentication & Authorization** - JWT-based auth with role-based access control
- **Artist Management** - Artist profiles with ownership validation
- **Song Management** - Upload, categorize, and manage music tracks
- **Playlist System** - Create, manage, and share playlists
- **Music Categories** - Automatic seeding and management of music genres
- **Popularity Tracking** - Advanced algorithms for song popularity and trending analysis
- **Listening Analytics** - Track plays, likes, and user engagement metrics

### Advanced Features
- **Multi-tier Guard System** - User, Artist, and Owner-level protection
- **Caching Layer** - Configurable in-memory and Redis caching
- **Database Relationships** - Complex many-to-many relationships between entities
- **Real-time Analytics** - Weighted popularity scoring with time-based analysis
- **Public/Private Content** - Flexible privacy controls for playlists and content

## 🛠 Tech Stack

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT with Passport
- **Caching**: Cache Manager (In-memory/Redis)
- **Validation**: Class Validator & Class Transformer
- **Testing**: Jest

## 🏗 Project Structure

```
src/
├── app.module.ts              # Main application module
├── main.ts                    # Application entry point
├── auth/                      # Authentication & JWT
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   └── dtos/
├── user/                      # User management
├── artist/                    # Artist profiles & management
│   ├── guards/               # Artist-specific guards
│   └── decorators/
├── song/                      # Song management
│   ├── guards/               # Song creation guards
│   └── decorators/
├── playlist/                  # Playlist CRUD operations
├── categories/                # Music genre management
├── popularity/                # Popularity tracking & analytics
├── listening/                 # Play tracking & listening history
├── cache/                     # Caching system
├── guards/                    # Global authentication guards
├── decorators/                # Custom parameter decorators
├── database/                  # Database configuration
└── seeders/                   # Database seeders
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16+)
- PostgreSQL
- npm or yarn

### Environment Variables
Create a `.env` file in the root directory:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=music_streaming_db

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Application
PORT=3000
NODE_ENV=development

# Redis (Optional)
REDIS_URL=redis://localhost:6379
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd proposal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up database**
   ```bash
   # Create PostgreSQL database
   createdb music_streaming_db
   ```

4. **Run database migrations/sync**
   ```bash
   npm run start:dev
   # Database tables will be auto-created on first run
   ```

5. **Start the application**
   ```bash
   # Development
   npm run start:dev
   
   # Production
   npm run build
   npm run start:prod
   ```

## 📡 API Endpoints

### Authentication
```http
POST /api/auth/register          # User registration
POST /api/auth/login             # User login
POST /api/auth/logout            # User logout
```

### User Management
```http
GET  /api/user/profile           # Get user profile (authenticated)
```

### Artist Management
```http
POST /api/artists                # Register as artist (auth required)
GET  /api/artists                # Get all artists (public)
GET  /api/artists/:id            # Get artist by ID (public)
PUT  /api/artists/:id            # Update artist (owner only)
DELETE /api/artists/:id          # Delete artist (owner only)
GET  /api/artists/my/artists     # Get my artists (auth required)
```

### Song Management
```http
POST /api/songs                  # Create song (artist only)
GET  /api/songs                  # Get all songs (auth required)
GET  /api/songs/:id              # Get song by ID (auth required)
```

### Playlist Management
```http
POST /api/playlists              # Create playlist (auth required)
GET  /api/playlists              # Get public playlists
GET  /api/playlists/my           # Get my playlists (auth required)
GET  /api/playlists/:id          # Get playlist by ID
PUT  /api/playlists/:id          # Update playlist (owner only)
DELETE /api/playlists/:id        # Delete playlist (owner only)
POST /api/playlists/:id/songs/:songId    # Add song to playlist
DELETE /api/playlists/:id/songs/:songId  # Remove song from playlist
```

### Categories
```http
GET  /api/categories             # Get all music categories
```

### Popularity & Analytics
```http
GET  /api/popularity/songs       # Get popular songs
GET  /api/popularity/trending    # Get trending songs
GET  /api/popularity/songs/:id   # Get song popularity metrics
GET  /api/popularity/charts/top100        # Top 100 songs
GET  /api/popularity/charts/:timeframe    # Charts by timeframe
```

### Listening Tracking
```http
POST /api/listening/track        # Track song play (auth required)
POST /api/listening/track/anonymous      # Track anonymous play
GET  /api/listening/history      # Get user listening history
GET  /api/listening/stats/:songId        # Get song listening stats
```

## 🔐 Authentication & Authorization

### JWT Authentication
The API uses JWT tokens for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

### Guard System

#### 1. **UserGuard**
- Requires valid JWT token
- Used for authenticated endpoints

#### 2. **OptionalUserGuard**
- Allows both authenticated and anonymous access
- Attaches user info if token provided

#### 3. **ArtistGuard**
- Requires user to have an artist profile
- Used for song creation and artist-specific actions

#### 4. **ArtistOwnerGuard**
- Validates artist ownership for modifications
- Prevents unauthorized access to artist resources

## 📊 Popularity Algorithm

The popularity system uses a weighted scoring algorithm:

```typescript
popularityScore = (playCount × 1) + (likeCount × 3) + 
                 (playlistAddCount × 2) + (recentPlays × 2-4)
```

### Metrics Tracked:
- **Play Count**: Total song plays
- **Like Count**: Number of user likes (higher weight)
- **Playlist Additions**: Songs added to playlists
- **Recent Activity**: Plays in the last 7 days (time-weighted)

### Trending Algorithm:
- Focuses on recent activity (last 7 days)
- Higher weights for recent plays and likes
- Filters songs with minimal activity

## 💾 Database Schema

### Core Entities
- **Users**: User accounts and profiles
- **Artists**: Artist profiles linked to users
- **Songs**: Music tracks with metadata
- **Playlists**: User-created playlists
- **Categories**: Music genres and categories

### Relationship Entities
- **SongArtists**: Many-to-many song-artist relationships
- **PlaylistSongs**: Playlist track listings
- **LikedSongs**: User song preferences
- **ListeningHistory**: Play tracking and analytics

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🔧 Development Scripts

```bash
npm run start:dev    # Development with hot reload
npm run start:debug  # Debug mode
npm run build        # Build for production
npm run format       # Format code with Prettier
npm run lint         # Lint and fix code
```

## 🚀 Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   ```bash
   export NODE_ENV=production
   export DATABASE_URL=your_production_db_url
   export JWT_SECRET=your_production_jwt_secret
   ```

3. **Run database migrations**
   ```bash
   # Ensure database is created and accessible
   npm run start:prod
   ```

4. **Start the application**
   ```bash
   npm run start:prod
   ```

## 📝 API Usage Examples

### User Registration & Login
```javascript
// Register
const registerResponse = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'john_doe',
    email: 'john@example.com',
    password: 'securePassword123'
  })
});

// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'securePassword123'
  })
});

const { access_token } = await loginResponse.json();
```

### Creating an Artist Profile
```javascript
const artistResponse = await fetch('/api/artists', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${access_token}`
  },
  body: JSON.stringify({
    name: 'John Doe Music',
    bio: 'Indie rock artist from NYC',
    genre: 'Rock'
  })
});
```

### Uploading a Song
```javascript
const songResponse = await fetch('/api/songs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${access_token}`
  },
  body: JSON.stringify({
    title: 'My New Song',
    duration: 180,
    category: 'Rock',
    fileUrl: 'https://example.com/song.mp3'
  })
});
```

### Getting Popular Songs
```javascript
// Get trending songs
const trending = await fetch('/api/popularity/trending?limit=10');
const trendingSongs = await trending.json();

// Get popular songs by timeframe
const popular = await fetch('/api/popularity/songs?timeframe=week&limit=20');
const popularSongs = await popular.json();
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the UNLICENSED License - see the package.json file for details.

## 🆘 Support

For support, please open an issue in the repository or contact the development team.

---

**Built with ❤️ using NestJS and TypeScript**

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
# flows-backend
