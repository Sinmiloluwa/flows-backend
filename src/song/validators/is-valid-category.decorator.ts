import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsValidCategoryConstraint } from './is-valid-category.validator';

export function IsValidCategory(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidCategoryConstraint,
    });
  };
}
