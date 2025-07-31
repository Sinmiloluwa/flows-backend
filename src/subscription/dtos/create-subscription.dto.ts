import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

enum SubscriptionPlan {
  FREE = 'free',
  PREMIUM = 'premium',
  FAMILY = 'family',
  STUDENT = 'student'
}

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsEnum(SubscriptionPlan)
  planType: SubscriptionPlan;

  @IsOptional()
  @IsString()
  paymentMethodId?: string;

  @IsOptional()
  @IsString()
  couponCode?: string;
}
