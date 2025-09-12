Login Credentials for Testing


Customer Account

TestingCustomer

TestingCustomer123!	



Shipper Account

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



Steps to Start and Run the Website

Requirements

Node.js (v18+ recommended)

Installing npm

In Frontend and Backend folders should have ‘.env’ file, if not then create .env file in both Frontend and Backend folder:
This is for .env in backend

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


