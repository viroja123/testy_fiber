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
import { Crop } from '../models/crop.model';

/**
 * CropService
 * Handles all CRUD operations for the 'crops' Firestore collection.
 * Provides real-time data streams.
 */
@Injectable({
  providedIn: 'root'
})
export class CropService {
  private firestore = inject(Firestore);
  private collectionName = 'crops';

  /**
   * Get all crops as a real-time observable, ordered by creation date
   * @returns Observable array of Crop objects
   */
  getCrops(): Observable<Crop[]> {
    const cropsRef = collection(this.firestore, this.collectionName);
    const q = query(cropsRef, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Crop[]>;
  }

  /**
   * Get a single crop by ID
   * @param id - Firestore document ID
   * @returns Observable of a single Crop
   */
  getCropById(id: string): Observable<Crop> {
    const cropDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    return docData(cropDoc, { idField: 'id' }) as Observable<Crop>;
  }

  /**
   * Add a new crop to Firestore
   * @param crop - Crop data (without id)
   * @returns Promise with the document reference
   */
  async addCrop(crop: Crop) {
    const cropsRef = collection(this.firestore, this.collectionName);
    const data = {
      ...crop,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    return addDoc(cropsRef, data);
  }

  /**
   * Update an existing crop document
   * @param id - Firestore document ID
   * @param crop - Partial crop data to update
   */
  async updateCrop(id: string, crop: Partial<Crop>) {
    const cropDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    const data = {
      ...crop,
      updatedAt: Timestamp.now()
    };
    return updateDoc(cropDoc, data);
  }

  /**
   * Delete a crop document
   * @param id - Firestore document ID
   */
  async deleteCrop(id: string) {
    const cropDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    return deleteDoc(cropDoc);
  }
}
