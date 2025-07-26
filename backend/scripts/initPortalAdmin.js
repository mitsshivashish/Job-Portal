import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import PortalAdmin from '../src/models/PortalAdmin.js';

// Load environment variables
dotenv.config();

const initializePortalAdmin = async () => {
  try {
    // Connect to MongoDB
      await mongoose.connect(process.env.MONGO_URL);

    // Check if portal admin already exists
    const existingAdmin = await PortalAdmin.findOne();
      if (existingAdmin) {
    process.exit(0);
  }

    // Default portal admin credentials
    const defaultAdmin = {
      name: 'Portal Administrator',
      email: 'portal@admin.com',
      password: 'admin123456'
    };

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultAdmin.password, salt);

    // Create portal admin
    const portalAdmin = await PortalAdmin.create({
      name: defaultAdmin.name,
      email: defaultAdmin.email,
      password: hashedPassword
    });

    

    process.exit(0);
  } catch (error) {
    console.error('Error initializing portal admin:', error);
    process.exit(1);
  }
};

// Run the initialization
initializePortalAdmin(); 