import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateTestItemDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  isActive: boolean;
}
