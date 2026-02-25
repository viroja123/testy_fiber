# 🌾 AgriSmart – Agriculture Management System

A full-stack web application for managing agricultural operations including farmer records, crop management, and sales tracking. Built with **Angular 19+** and **Firebase**.

---

## 🚀 Technology Stack

| Technology             | Purpose                                    |
| ---------------------- | ------------------------------------------ |
| **Angular 19**         | Frontend Framework (Standalone Components) |
| **Firebase Auth**      | Email/Password Authentication              |
| **Firebase Firestore** | NoSQL Cloud Database                       |
| **Firebase Hosting**   | Web Hosting                                |
| **Bootstrap 5**        | Responsive UI Framework                    |
| **RxJS**               | Reactive Programming                       |
| **TypeScript**         | Type-safe JavaScript                       |

---

## 📁 Project Structure

```
agri-smart/
├── src/
│   ├── app/
│   │   ├── auth/                     # Authentication Module
│   │   │   ├── login/
│   │   │   │   └── login.component.ts
│   │   │   └── auth.routes.ts
│   │   ├── dashboard/                # Dashboard Module
│   │   │   ├── dashboard.component.ts
│   │   │   └── dashboard.routes.ts
│   │   ├── farmers/                  # Farmer Management Module
│   │   │   ├── farmer-list/
│   │   │   │   └── farmer-list.component.ts
│   │   │   ├── farmer-form/
│   │   │   │   └── farmer-form.component.ts
│   │   │   └── farmers.routes.ts
│   │   ├── crops/                    # Crop Management Module
│   │   │   ├── crop-list/
│   │   │   │   └── crop-list.component.ts
│   │   │   ├── crop-form/
│   │   │   │   └── crop-form.component.ts
│   │   │   └── crops.routes.ts
│   │   ├── sales/                    # Sales Management Module
│   │   │   ├── sale-list/
│   │   │   │   └── sale-list.component.ts
│   │   │   ├── sale-form/
│   │   │   │   └── sale-form.component.ts
│   │   │   └── sales.routes.ts
│   │   ├── services/                 # Firebase Services
│   │   │   ├── auth.service.ts
│   │   │   ├── farmer.service.ts
│   │   │   ├── crop.service.ts
│   │   │   └── sale.service.ts
│   │   ├── models/                   # Data Models
│   │   │   ├── farmer.model.ts
│   │   │   ├── crop.model.ts
│   │   │   └── sale.model.ts
│   │   ├── guards/                   # Route Guards
│   │   │   └── auth.guard.ts
│   │   ├── shared/                   # Shared Components
│   │   │   ├── navbar/
│   │   │   │   └── navbar.component.ts
│   │   │   └── spinner/
│   │   │       └── spinner.component.ts
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── .firebaserc
├── angular.json
├── package.json
└── README.md
```

---

## 🔥 Firebase Setup Instructions

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"** and follow the wizard
3. Enable **Google Analytics** (optional)

### Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Go to **Users** tab and add an admin user:
   - Click **"Add user"**
   - Enter email: `admin@agrismart.com`
   - Enter password: `Admin@123`

### Step 3: Create Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **Start in test mode** (or production mode with rules)
3. Select your preferred Cloud Firestore location
4. The required collections will be auto-created when you add data:
   - `farmers` - Farmer records
   - `crops` - Crop records
   - `sales` - Sale records
   - `users` - User profiles

### Step 4: Get Firebase Config

1. Go to **Project Settings** → **General**
2. Scroll to **"Your apps"** → Click **Web** (`</>`)
3. Register your app with nickname "AgriSmart"
4. Copy the Firebase config object

### Step 5: Update Environment Files

Open `src/environments/environment.ts` and replace the placeholder values:

```typescript
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'YOUR_ACTUAL_API_KEY',
    authDomain: 'your-project.firebaseapp.com',
    projectId: 'your-project-id',
    storageBucket: 'your-project.appspot.com',
    messagingSenderId: 'your-sender-id',
    appId: 'your-app-id',
  },
};
```

Do the same for `src/environments/environment.prod.ts`.

---

## 🛠️ Installation & Running

### Prerequisites

- **Node.js** 18+ installed
- **Angular CLI** installed globally (`npm install -g @angular/cli`)
- **Firebase CLI** installed globally (`npm install -g firebase-tools`)

### Install Dependencies

```bash
cd agri-smart
npm install
```

### Run Development Server

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The app will auto-reload on file changes.

### Build for Production

```bash
ng build --configuration=production
```

---

## 🚀 Firebase Hosting Deployment

### Step 1: Login to Firebase

```bash
firebase login
```

### Step 2: Initialize Firebase (if needed)

```bash
firebase init
```

Select **Hosting** and **Firestore**.

### Step 3: Build and Deploy

```bash
ng build --configuration=production
firebase deploy
```

---

## 📊 Firestore Collections Structure

### `farmers` Collection

| Field     | Type      | Description           |
| --------- | --------- | --------------------- |
| name      | string    | Farmer's full name    |
| phone     | string    | 10-digit phone number |
| address   | string    | Full address          |
| landArea  | number    | Land area in acres    |
| createdAt | timestamp | Record creation time  |
| updatedAt | timestamp | Last update time      |

### `crops` Collection

| Field     | Type      | Description                      |
| --------- | --------- | -------------------------------- |
| cropName  | string    | Name of the crop                 |
| type      | string    | Grain/Vegetable/Fruit/Pulse/etc. |
| season    | string    | Kharif/Rabi/Zaid                 |
| quantity  | number    | Quantity in kg                   |
| price     | number    | Price per kg (₹)                 |
| createdAt | timestamp | Record creation time             |
| updatedAt | timestamp | Last update time                 |

### `sales` Collection

| Field        | Type      | Description            |
| ------------ | --------- | ---------------------- |
| farmerName   | string    | Farmer who sold        |
| cropName     | string    | Crop sold              |
| quantitySold | number    | Quantity sold in kg    |
| totalPrice   | number    | Total sale price (₹)   |
| date         | string    | Sale date (YYYY-MM-DD) |
| createdAt    | timestamp | Record creation time   |
| updatedAt    | timestamp | Last update time       |

---

## ✨ Features

- ✅ **Firebase Authentication** - Secure admin login/logout
- ✅ **Route Guards** - Protected dashboard pages
- ✅ **Real-time Updates** - Firestore live data streams
- ✅ **CRUD Operations** - Full create, read, update, delete for all modules
- ✅ **Reactive Forms** - Client-side validation with error messages
- ✅ **Search & Filter** - Search farmers, filter crops by season
- ✅ **Loading Spinner** - Visual feedback during operations
- ✅ **Success/Error Alerts** - User-friendly notifications
- ✅ **Responsive Design** - Mobile-first with Bootstrap
- ✅ **Lazy Loading** - Optimized bundle sizes per module
- ✅ **Clean Architecture** - Proper folder structure and separation of concerns
- ✅ **Premium UI** - Glassmorphism, gradients, micro-animations

---

## 🎨 Module Overview

| Module        | Features                                                       |
| ------------- | -------------------------------------------------------------- |
| **Auth**      | Login form, Firebase Auth, password toggle, error handling     |
| **Dashboard** | Stats cards, bar chart, season distribution, recent records    |
| **Farmers**   | CRUD, search, responsive table, delete confirmation modal      |
| **Crops**     | CRUD, season filter chips, card grid, total value calculator   |
| **Sales**     | CRUD, revenue summary bar, farmer/crop dropdowns, sale preview |

---

## 📝 License

This project is for educational purposes.
