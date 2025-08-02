import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ListeningTrackingService } from './listening-tracking.service';
import { ListeningController } from './listening.controller';
import { ListeningHistory } from '../listening-history/entities/listening-history.entity';

@Module({
  imports: [JwtModule],
  providers: [
    ListeningTrackingService,
    {
      provide: 'LISTENING_HISTORY_REPOSITORY',
      useValue: ListeningHistory,
    }
  ],
  controllers: [ListeningController],
  exports: [ListeningTrackingService]
})
export class ListeningModule {}
