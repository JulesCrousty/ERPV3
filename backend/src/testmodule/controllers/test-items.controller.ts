import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TestItemsService } from '../services/test-items.service';
import { CreateTestItemDto } from '../dto/create-test-item.dto';
import { UpdateTestItemDto } from '../dto/update-test-item.dto';
import { JwtAuthGuard } from '../../core/services/jwt-auth.guard';
import { Permissions, PermissionsGuard } from '../../core/services/permissions.guard';

@Controller('test/items')
export class TestItemsController {
  constructor(private readonly testItemsService: TestItemsService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('test.items.read')
  @Get()
  findAll() {
    return this.testItemsService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('test.items.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testItemsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('test.items.write')
  @Post()
  create(@Body() dto: CreateTestItemDto) {
    return this.testItemsService.create(dto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('test.items.write')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTestItemDto) {
    return this.testItemsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('test.items.write')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testItemsService.remove(id);
  }
}
