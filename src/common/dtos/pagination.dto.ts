import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    example: 5,
    default: 5,
    description: 'Rows per page',
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit: number;

  @ApiProperty({
    example: 0,
    default: 0,
    description: 'Rows to skip',
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}
