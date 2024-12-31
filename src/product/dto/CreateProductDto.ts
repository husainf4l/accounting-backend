import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsPositive,
  IsNumber,
  IsUUID,
  IsUrl,
  IsEnum,
  Min,
  Max,
} from 'class-validator';

export interface CreateProductDto {
  barcode?: string;
  name: string;
  description?: string;
  costPrice?: number; // Change to number
  salesPrice?: number; // Change to number
  wholesalePrice?: number; // Change to number
  avgPrice?: number;
  stock?: number; // Change to number
  reorderLevel?: number;
  isActive?: string | boolean | null; // Allow string, boolean, or null
  origin?: string;
  family?: string;
  subFamily?: string;
  taxRate?: number;
  discountRate?: number;
  profitMargin?: number;
  location?: string;
  packaging?: string;
  category?: string;
  nrv?: number;
  itemType?: string;
  imageUrl?: string;
}
