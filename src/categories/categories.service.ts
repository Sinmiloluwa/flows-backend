import { Inject, Injectable } from '@nestjs/common';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
    constructor(
        @Inject('CATEGORY_REPOSITORY') private readonly categoryModel: typeof Category,
    ) {}

    async findAll(): Promise<Category[]> {
        return await this.categoryModel.findAll();
    }
}
