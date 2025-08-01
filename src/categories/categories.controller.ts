import { Controller, Get, Inject } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
    constructor(
        @Inject() private readonly categoriesService: CategoriesService,

    ) {}

    @Get()
    async findAll() {
        return await this.categoriesService.findAll();
    }
}
