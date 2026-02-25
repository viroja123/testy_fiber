/**
 * Sale Model
 * Represents a sale document in the Firestore 'sales' collection
 */
export interface Sale {
  id?: string;
  farmerName: string;
  cropName: string;
  quantitySold: number;   // Quantity sold in kg
  totalPrice: number;     // Total sale price
  date: string;           // Sale date in YYYY-MM-DD format
  createdAt?: Date;
  updatedAt?: Date;
}
