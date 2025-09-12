Login Credentials for Testing<img width="468" height="52" alt="image" src="https://github.com/user-attachments/assets/ef972531-4495-42d3-9092-dbe9eda28442" />

Customer Account
TestingCustomer
TestingCustomer123!	Shipper Account
Ho Chi Minh Hub
ShipperOne
ShipperOne123!

Ha Noi Hub
ShipperHaNoi
ShipperHaNoi123!

Da Nang Hub
ShipperDaNang
ShipperDaNang123!

Vendor Account
VendorTesting
VendorTesting123!	
<img width="468" height="216" alt="image" src="https://github.com/user-attachments/assets/f7def3f8-2f72-4c74-b79e-4a9675cefb95" />


Steps to Start and Run the Website

Requirements
Node.js (v18+ recommended)
Installing npm
In Frontend and Backend folders should have ‘.env’ file, if not then create .env file in both Frontend and Backend folder:
This is for .env in backend
<img width="468" height="267" alt="image" src="https://github.com/user-attachments/assets/ac227b64-411a-4659-b00e-4ffd2d88e3b0" />

PORT=5001
MONGODB_URI=mongodb+srv://<db_user>:<db_password>@cluster0.mongodb.net/ecommerce
SESSION_SECRET=<your_random_secret>
FRONTEND_URL=http://localhost:5173
UPLOAD_DIR=uploads

This is for .env in frontend
VITE_API_BASE=http://localhost:5001

Next Steps:
Open Terminal from “ecommerce-platform-2025” folder
npm install
npm run dev:full 

The Web is now should be running normally!

To close the Web completely:
Control + C
npx kill-port 5001
<img width="468" height="365" alt="image" src="https://github.com/user-attachments/assets/23242e99-1298-4020-b950-13b1662dbd91" />

