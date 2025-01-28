


import bcrypt from 'bcrypt';
import {User}  from '../models/user.models.js'; // Adjust the import path


 const registerUser = async (req, res) => {
  try {
    const {
      block,
      houseNo,
      password,
      societyId,
      email,
      nameOfPersons,
      phoneNo,
      numberOfVeh,
      vehicleNo
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Check if house number is unique within the society
    const existingHouse = await User.findOne({ societyId, houseNo });
    if (existingHouse) {
      return res.status(400).json({ 
        message: 'House number already registered in this society' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      block,
      houseNo,
      password: hashedPassword,
      societyId,
      email,
      nameOfPersons,
      phoneNo,
      numberOfVeh,
      vehicleNo
    });

    // Return user data without password
    const userResponse = {
      _id: newUser._id,
      block: newUser.block,
      houseNo: newUser.houseNo,
      societyId: newUser.societyId,
      email: newUser.email,
      nameOfPersons: newUser.nameOfPersons,
      phoneNo: newUser.phoneNo,
      numberOfVeh: newUser.numberOfVeh,
      vehicleNo: newUser.vehicleNo,
      createdAt: newUser.createdAt
    };

    res.status(201).json(userResponse);

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};

export { registerUser };