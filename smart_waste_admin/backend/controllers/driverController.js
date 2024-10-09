const { db } = require('../firebaseAdmin');
const Driver = require('../models/driverModel');

// Create and Save Driver and User with Firebase Auth
exports.registerDriver = async (req, res) => {
  const { email, location, name, phone, NIC, Password } = req.body;

  try {
    // 2. Create a new Driver instance with the provided information
    const driver = new Driver(email, location, name, phone, NIC, Password);

    // 3. Save the Driver data to Firestore
    const docRef = await db.collection('driver').add({
      email: driver.email,
      location: driver.location,
      name: driver.name,
      phone: driver.phone,
      NIC: driver.NIC,
      Password: driver.Password,
    });

    // 4. Respond with success and the Firestore document ID
    res.status(200).json({
      message: 'driver registered and user created successfully',
      id: docRef.id,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error registering driver or creating user',
      error: error.message,
    });
  }
};
