/*
Authentication routes - Task 1 & 2
POST /register/customer
 POST /register/vendor  
 POST /register/shipper
 POST /login
 POST /logout
GET /auth/me
*/
// just test route hehe
import { Router } from 'express';
const router = Router();

// Example route
router.get('/auth/test', (req, res) => {
  res.json({ message: 'Auth route works!' });
});

export default router;