/**
 * Environment configuration for AgriSmart
 * Replace the firebaseConfig values with your own Firebase project credentials.
 * You can find these in the Firebase Console > Project Settings > General > Your apps
 */
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_PROJECT.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT.appspot.com',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID',
  },
};
