/**
 * Farmer Model
 * Represents a farmer document in the Firestore 'farmers' collection
 */
export interface Farmer {
  id?: string;
  name: string;
  phone: string;
  address: string;
  landArea: number;      // Land area in acres
  createdAt?: Date;
  updatedAt?: Date;
}
