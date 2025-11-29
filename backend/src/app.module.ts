import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './config/ormconfig';
import { CoreModule } from './core/core.module';
import { TestModule } from './testmodule/test.module';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), CoreModule, TestModule],
})
export class AppModule {}
