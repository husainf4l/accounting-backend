export interface FIFOLayer {
  quantity: number;
  costPerUnit: number;
}

export interface UpdateInventoryDto {
  sku: string;
  updatedQuantity: number;
  fifoLayers: FIFOLayer[];
}
