import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ICacheService } from './interfaces/cache.interface';
import { InMemoryCacheService } from './services/in-memory-cache.service';
import { RedisCacheService } from './services/redis-cache.service';

@Module({
  providers: [
    {
      provide: 'CACHE_SERVICE',
      useFactory: (configService: ConfigService) => {
        const cacheType = configService.get<string>('CACHE_TYPE', 'memory');
        
        if (cacheType === 'redis') {
          return new RedisCacheService();
        }
        
        return new InMemoryCacheService();
      },
      inject: [ConfigService],
    },
  ],
  exports: ['CACHE_SERVICE'],
})
export class CacheModule {}
