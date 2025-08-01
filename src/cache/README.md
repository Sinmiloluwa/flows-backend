# Cache System

This project includes a flexible caching system that supports both in-memory and Redis caching.

## Configuration

The cache type is controlled by the `CACHE_TYPE` environment variable:

- `CACHE_TYPE=memory` (default) - Uses in-memory caching
- `CACHE_TYPE=redis` - Uses Redis caching

## Environment Variables

### For Redis (when CACHE_TYPE=redis):
```env
CACHE_TYPE=redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password
REDIS_DB=0
```

### For In-Memory (default):
```env
CACHE_TYPE=memory
```

## Installing Redis Support

To use Redis caching, install the required package:

```bash
npm install ioredis
npm install --save-dev @types/ioredis
```

## Usage in Services

```typescript
import { Inject, Injectable } from '@nestjs/common';
import { ICacheService } from '../cache/interfaces/cache.interface';

@Injectable()
export class MyService {
  constructor(
    @Inject('CACHE_SERVICE') private readonly cacheService: ICacheService
  ) {}

  async getData(): Promise<any[]> {
    const cacheKey = 'my-data';
    
    // Try cache first
    const cached = await this.cacheService.get<any[]>(cacheKey);
    if (cached) {
      return cached;
    }
    
    // Fetch from database
    const data = await this.fetchFromDatabase();
    
    // Cache for 5 minutes (300,000 ms)
    await this.cacheService.set(cacheKey, data, 300000);
    
    return data;
  }

  async clearCache(): Promise<void> {
    await this.cacheService.del('my-data');
  }
}
```

## Cache Methods

- `get<T>(key: string): Promise<T | null>` - Get cached value
- `set(key: string, value: any, ttlMs?: number): Promise<void>` - Set cache with TTL in milliseconds
- `del(key: string): Promise<void>` - Delete specific cache key
- `clear(): Promise<void>` - Clear all cache (Redis: current DB, Memory: all entries)

## Switching Between Cache Types

1. **Development**: Use in-memory cache (faster, no external dependencies)
2. **Production**: Use Redis cache (persistent, scalable, shared between instances)

Simply change the `CACHE_TYPE` environment variable and restart your application.
