import { Injectable } from '@nestjs/common';
import { ICacheService } from '../interfaces/cache.interface';

@Injectable()
export class InMemoryCacheService implements ICacheService {
  private cache = new Map<string, { data: any; expiry: number }>();

  async get<T>(key: string): Promise<T | null> {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (this.isExpired(cached.expiry)) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data as T;
  }

  async set(key: string, value: any, ttlMs: number = 300000): Promise<void> {
    const expiry = Date.now() + ttlMs;
    this.cache.set(key, { data: value, expiry });
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  private isExpired(expiry: number): boolean {
    return Date.now() > expiry;
  }
}
