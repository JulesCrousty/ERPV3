import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '../core/core.module';
import { TestItem } from './entities/test-item.entity';
import { TestItemsService } from './services/test-items.service';
import { TestItemsController } from './controllers/test-items.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TestItem]), CoreModule],
  controllers: [TestItemsController],
  providers: [TestItemsService],
})
export class TestModule {}
