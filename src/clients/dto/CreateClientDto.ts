export interface CreateClientDto {
    name: string;
    nameAr?: string;
    email?: string;
    phone?: string;
    address?: string;
    taxId: string; // Must be unique per company
    openingBalance?: number; // Optional, for creating journal entries
}
