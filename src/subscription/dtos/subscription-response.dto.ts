export class SubscriptionResponseDto {
  id: string;
  planType: string;
  status: string;
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  price: number;
  currency: string;
  userId: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
  features: {
    adFree: boolean;
    offlinePlayback: boolean;
    highQualityAudio: boolean;
    unlimitedSkips: boolean;
    familySharing: boolean;
    maxDevices: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
