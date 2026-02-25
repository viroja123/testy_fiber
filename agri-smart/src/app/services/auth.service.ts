import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * AuthService
 * Handles Firebase Authentication operations including
 * login, logout, and user state management.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  /** Observable that emits the current authenticated user */
  currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor() {
    // Listen for authentication state changes
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  /**
   * Sign in with email and password
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise with the user credential
   */
  async login(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sign out the current user
   */
  async logout() {
    try {
      await signOut(this.auth);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if a user is currently logged in
   * @returns true if user is authenticated
   */
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Get the current authenticated user
   * @returns The current user or null
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
