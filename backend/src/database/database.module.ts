import { Module } from '@nestjs/common';
import { InMemoryAdapter } from 'adapters/in-memory.adapter';
import { DatabaseService } from './database.service';

@Module({
  providers: [
    DatabaseService,
    {
      useClass: InMemoryAdapter,
      provide: 'DATABASE_REPOSITORY',
    },
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
