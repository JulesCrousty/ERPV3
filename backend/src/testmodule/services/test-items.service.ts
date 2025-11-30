import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestItem } from '../entities/test-item.entity';
import { CreateTestItemDto } from '../dto/create-test-item.dto';
import { UpdateTestItemDto } from '../dto/update-test-item.dto';

@Injectable()
export class TestItemsService {
  constructor(
    @InjectRepository(TestItem)
    private readonly testItemsRepository: Repository<TestItem>,
  ) {}

  create(dto: CreateTestItemDto) {
    const item = this.testItemsRepository.create(dto);
    return this.testItemsRepository.save(item);
  }

  findAll() {
    return this.testItemsRepository.find();
  }

  async findOne(id: string) {
    const item = await this.testItemsRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('Test item not found');
    }
    return item;
  }

  async update(id: string, dto: UpdateTestItemDto) {
    await this.findOne(id);
    await this.testItemsRepository.update({ id }, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.testItemsRepository.delete(id);
    return { deleted: true };
  }
}
