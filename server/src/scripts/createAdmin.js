const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('../models/Admin');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log('Connected to MongoDB');

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('Admin123', salt);

    const admin = new Admin({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@campus.com',
      password: hash,
    });

    await admin.save();
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin(); 