import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class FIFO {
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  costPerUnit: number;
}

export class UpdateInventoryDto {
  @IsString()
  sku: string;

  @IsNumber()
  @Min(1)
  updatedQuantity: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FIFO)
  fifoLayers: FIFO[];
}
