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
import { Observable, map } from 'rxjs';
import { Farmer } from '../models/farmer.model';

/**
 * FarmerService
 * Handles all CRUD operations for the 'farmers' Firestore collection.
 * Provides real-time data streams via Firestore's onSnapshot under the hood.
 */
@Injectable({
  providedIn: 'root'
})
export class FarmerService {
  private firestore = inject(Firestore);
  private collectionName = 'farmers';

  /**
   * Get all farmers as a real-time observable, ordered by creation date
   * @returns Observable array of Farmer objects
   */
  getFarmers(): Observable<Farmer[]> {
    const farmersRef = collection(this.firestore, this.collectionName);
    const q = query(farmersRef, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Farmer[]>;
  }

  /**
   * Get a single farmer by ID
   * @param id - Firestore document ID
   * @returns Observable of a single Farmer
   */
  getFarmerById(id: string): Observable<Farmer> {
    const farmerDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    return docData(farmerDoc, { idField: 'id' }) as Observable<Farmer>;
  }

  /**
   * Add a new farmer to Firestore
   * @param farmer - Farmer data (without id)
   * @returns Promise with the document reference
   */
  async addFarmer(farmer: Farmer) {
    const farmersRef = collection(this.firestore, this.collectionName);
    const data = {
      ...farmer,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    return addDoc(farmersRef, data);
  }

  /**
   * Update an existing farmer document
   * @param id - Firestore document ID
   * @param farmer - Partial farmer data to update
   */
  async updateFarmer(id: string, farmer: Partial<Farmer>) {
    const farmerDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    const data = {
      ...farmer,
      updatedAt: Timestamp.now()
    };
    return updateDoc(farmerDoc, data);
  }

  /**
   * Delete a farmer document
   * @param id - Firestore document ID
   */
  async deleteFarmer(id: string) {
    const farmerDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    return deleteDoc(farmerDoc);
  }
}
