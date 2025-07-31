import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './entities/category.entity';

const defaultCategories = [
  { name: 'Pop', isActive: true },
  { name: 'Rock', isActive: true },
  { name: 'Hip-Hop', isActive: true },
  { name: 'Jazz', isActive: true },
  { name: 'Classical', isActive: true },
  { name: 'Afrobeats', isActive: true },
  { name: 'Gospel', isActive: true },
  { name: 'Electronic', isActive: true },
  { name: 'Reggae', isActive: true },
  { name: 'R&B', isActive: true }
];

@Injectable()
export class CategoriesSeeder implements OnModuleInit {
  constructor(
    @Inject('CATEGORY_REPOSITORY') private readonly categoryModel: typeof Category,
  ) {}

  async onModuleInit() {
    for (const cat of defaultCategories) {
      await this.categoryModel.findOrCreate({ where: { name: cat.name }, defaults: cat });
    }
  }
}
