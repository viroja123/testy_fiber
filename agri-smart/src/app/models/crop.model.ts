/**
 * Crop Model
 * Represents a crop document in the Firestore 'crops' collection
 */
export interface Crop {
  id?: string;
  cropName: string;
  type: string;           // e.g., 'Grain', 'Vegetable', 'Fruit', 'Pulse'
  season: string;         // e.g., 'Kharif', 'Rabi', 'Zaid'
  quantity: number;       // Quantity in kg
  price: number;          // Price per unit in currency
  createdAt?: Date;
  updatedAt?: Date;
}
