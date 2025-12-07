export type ClientDocumentType = 'CPF' | 'CNPJ';

export interface ClientAddress {
  street: string;
  number: string;
  complement?: string | null;
  neighborhood?: string | null;
  city: string;
  state: string;
  postalCode: string;
}

export interface Client {
  id: string;
  name: string;

  documentNumber: string;
  documentType: ClientDocumentType;

  email?: string | null;

  phone?: string | null;

  address?: ClientAddress | null;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;

  createdByAdminId?: string | null;

  updatedByAdminId?: string | null;

  birthDate?: Date | null;
}
