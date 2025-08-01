import { Injectable } from '@nestjs/common';
import { ICacheService } from '../interfaces/cache.interface';
import Redis from 'ioredis';

@Injectable()
export class RedisCacheService implements ICacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0'),
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const cached = await this.redis.get(key);
    if (!cached) return null;
    
    try {
      return JSON.parse(cached) as T;
    } catch (error) {
      console.error('Error parsing cached data:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttlMs: number = 300000): Promise<void> {
    const serialized = JSON.stringify(value);
    const ttlSeconds = Math.ceil(ttlMs / 1000);
    await this.redis.setex(key, ttlSeconds, serialized);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async clear(): Promise<void> {
    await this.redis.flushdb();
  }
}
