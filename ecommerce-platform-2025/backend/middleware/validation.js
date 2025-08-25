// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Huynh Ngoc Nhat mai
// ID: s3926881

const validateRegistration = (req, res, next) => {
  const { role, username, password } = req.body;
  
  // Username validation
  if (!username || !usernameRegex.test(username)) {
    return res.status(400).json({ 
      message: "Username must be 8-15 characters containing only letters and digits." 
    });
  }

  // Password validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
  if (!password || !passwordRegex.test(password)) {
    return res.status(400).json({ 
      message: "Password must be 8-20 characters with at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*). Only these characters are allowed." 
    });
  }

  // Role-specific validation
  if (role === "customer") {
    const { fullName, address } = req.body;
    if (!fullName || fullName.trim().length < 5) {
      return res.status(400).json({ message: "Full name must be at least 5 characters long." });
    }
    if (!address || address.trim().length < 5) {
      return res.status(400).json({ message: "Address must be at least 5 characters long." });
    }
  } else if (role === "vendor") {
    const { businessName, businessAddress } = req.body;
    if (!businessName || businessName.trim().length < 5) {
      return res.status(400).json({ message: "Business name must be at least 5 characters long." });
    }
    if (!businessAddress || businessAddress.trim().length < 5) {
      return res.status(400).json({ message: "Business address must be at least 5 characters long." });
    }
  } else if (role === "shipper") {
    const { distributionHub } = req.body;
    const validHubs = ["Ho Chi Minh", "Da Nang", "Hanoi"];
    if (!distributionHub || !validHubs.includes(distributionHub)) {
      return res.status(400).json({ 
        message: "Distribution hub must be one of: Ho Chi Minh, Da Nang, Hanoi" 
      });
    }
  } else {
    return res.status(400).json({ message: "Role must be customer, vendor, or shipper." });
  }

  next();
};

const validateProduct = (req, res, next) => {
  const { name, price, description } = req.body;
  
  // Product name
  if (!name || name.trim().length < 10 || name.trim().length > 20) {
    return res.status(400).json({ 
      message: "Product name must be between 10 and 20 characters long." 
    });
  }

  // Price: positive number
  const priceNum = Number(price);
  if (!price || isNaN(priceNum) || priceNum <= 0) {
    return res.status(400).json({ 
      message: "Price must be a positive number greater than 0." 
    });
  }

  // Description
  if (description && description.length > 500) {
    return res.status(400).json({ 
      message: "Description cannot exceed 500 characters." 
    });
  }

  next();
};

const validateOrder = (req, res, next) => {
  const { items, distributionHub } = req.body;

  // Items validation
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Order must contain at least one item." });
  }

  // Distribution hub validation
  const validHubs = ["Ho Chi Minh", "Da Nang", "Hanoi"];
  if (!distributionHub || !validHubs.includes(distributionHub)) {
    return res.status(400).json({ 
      message: "Distribution hub must be one of: Ho Chi Minh, Da Nang, Hanoi" 
    });
  }

  // Validate each item
  for (const item of items) {
    if (!item.productName || item.productName.trim().length === 0) {
      return res.status(400).json({ message: "Each item must have a product name." });
    }
    if (!item.quantity || item.quantity < 1) {
      return res.status(400).json({ message: "Each item must have a quantity of at least 1." });
    }
    if (!item.price || item.price < 0) {
      return res.status(400).json({ message: "Each item must have a valid price." });
    }
  }

  next();
};

module.exports = { 
  validateRegistration, 
  validateProduct, 
  validateOrder 
};