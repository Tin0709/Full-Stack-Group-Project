#  E-commerce Platform 2025

##  Login Credentials for Testing

### Customer Account
- **Username:** `TestingCustomer`  
- **Password:** `TestingCustomer123!`

### Shipper Accounts
**Ho Chi Minh Hub**  
- **Username:** `ShipperOne`  
- **Password:** `ShipperOne123!`

**Ha Noi Hub**  
- **Username:** `ShipperHaNoi`  
- **Password:** `ShipperHaNoi123!`

**Da Nang Hub**  
- **Username:** `ShipperDaNang`  
- **Password:** `ShipperDaNang123!`

### Vendor Account
- **Username:** `VendorTesting`  
- **Password:** `VendorTesting123!`

---

## ⚙️ Steps to Start and Run the Website

### Requirements
- [Node.js](https://nodejs.org/) (v18+ recommended)  
- npm (comes with Node.js)  

### Environment Variables

#### Backend (`/backend/.env`)
```env
PORT=5001
MONGODB_URI=mongodb+srv://<db_user>:<db_password>@cluster0.mongodb.net/ecommerce
SESSION_SECRET=<your_random_secret>
FRONTEND_URL=http://localhost:5173
UPLOAD_DIR=uploads
```

#### Frontend (`/frontend/.env`)
```env
VITE_API_BASE=http://localhost:5001
```

### Install & Run
- npm install
- npm run dev:full
### The app should now be running!
---
### Stop the Server
- CTRL + C
- npx kill-port 5001
