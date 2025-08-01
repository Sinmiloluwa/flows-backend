export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: any, ttlMs?: number): Promise<void>;
  del(key: string): Promise<void>;
  clear(): Promise<void>;
}
