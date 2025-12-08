import { ClientDocumentType } from '../domain/Client';

export interface ClientAddressDTO {
  street: string;
  number: string;
  complement?: string | null;
  neighborhood?: string | null;
  city: string;
  state: string;
  postalCode: string;
}

export interface CreateClientDTO {
  name: string;
  documentNumber: string;
  documentType: ClientDocumentType;
  email?: string;
  phone?: string;
  address?: ClientAddressDTO;
  birthDate?: string;
  isActive?: boolean;
}

export interface UpdateClientDTO {
  name?: string;
  email?: string;
  phone?: string;
  address?: ClientAddressDTO | null;
  birthDate?: string | null;
  isActive?: boolean;
}

export interface ClientResponseDTO {
  id: string;
  name: string;
  documentNumber: string;
  documentType: ClientDocumentType;
  email?: string | null;
  phone?: string | null;
  address?: ClientAddressDTO | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  birthDate?: string | null;
}
