import { Inject, Injectable } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { ICacheService } from '../cache/interfaces/cache.interface';

@Injectable()
export class CategoriesService {
    constructor(
        @Inject('CATEGORY_REPOSITORY') private readonly categoryModel: typeof Category,
        @Inject('CACHE_SERVICE') private readonly cacheService: ICacheService
    ) {}

    async findAll(): Promise<Category[]> {
        const cacheKey = 'categories';
        
        const cachedCategories = await this.cacheService.get<Category[]>(cacheKey);
        if (cachedCategories) {
            return cachedCategories;
        }
        
        console.log('Fetching categories from database');
        const categories = await this.categoryModel.findAll();
        
        await this.cacheService.set(cacheKey, categories, 300000);
        
        return categories;
    }

    async clearCache(): Promise<void> {
        await this.cacheService.del('categories');
    }
}
