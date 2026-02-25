import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Sale } from '../models/sale.model';

/**
 * SaleService
 * Handles all CRUD operations for the 'sales' Firestore collection.
 * Provides real-time data streams.
 */
@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private firestore = inject(Firestore);
  private collectionName = 'sales';

  /**
   * Get all sales as a real-time observable, ordered by creation date
   * @returns Observable array of Sale objects
   */
  getSales(): Observable<Sale[]> {
    const salesRef = collection(this.firestore, this.collectionName);
    const q = query(salesRef, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Sale[]>;
  }

  /**
   * Get a single sale by ID
   * @param id - Firestore document ID
   * @returns Observable of a single Sale
   */
  getSaleById(id: string): Observable<Sale> {
    const saleDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    return docData(saleDoc, { idField: 'id' }) as Observable<Sale>;
  }

  /**
   * Add a new sale to Firestore
   * @param sale - Sale data (without id)
   * @returns Promise with the document reference
   */
  async addSale(sale: Sale) {
    const salesRef = collection(this.firestore, this.collectionName);
    const data = {
      ...sale,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    return addDoc(salesRef, data);
  }

  /**
   * Update an existing sale document
   * @param id - Firestore document ID
   * @param sale - Partial sale data to update
   */
  async updateSale(id: string, sale: Partial<Sale>) {
    const saleDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    const data = {
      ...sale,
      updatedAt: Timestamp.now()
    };
    return updateDoc(saleDoc, data);
  }

  /**
   * Delete a sale document
   * @param id - Firestore document ID
   */
  async deleteSale(id: string) {
    const saleDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    return deleteDoc(saleDoc);
  }
}
