import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoriesSeeder } from './categories.seeder';
import { Category } from './entities/category.entity';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [CacheModule],
  providers: [
    {
      provide: 'CATEGORY_REPOSITORY',
      useValue: Category,
    },
    CategoriesService, 
    CategoriesSeeder
  ],
  controllers: [CategoriesController]
})
export class CategoriesModule {}
