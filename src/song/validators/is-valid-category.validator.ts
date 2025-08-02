import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Category } from '../../categories/entities/category.entity';

@ValidatorConstraint({ name: 'isValidCategory', async: true })
export class IsValidCategoryConstraint implements ValidatorConstraintInterface {
  async validate(categoryName: string, args: ValidationArguments) {
    if (!categoryName) {
      return true; // Let @IsOptional handle empty values
    }

    try {
      const category = await Category.findOne({
        where: { 
          name: categoryName,
          isActive: true 
        }
      });
      return !!category;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'Genre must be a valid active category';
  }
}
