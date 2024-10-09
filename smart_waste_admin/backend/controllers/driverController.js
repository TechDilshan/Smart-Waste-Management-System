const { db } = require('../firebaseAdmin');
const Driver = require('../models/driverModel');

// Create and Save Driver and Driver with Firebase Auth
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
      message: 'driver registered and Driver created successfully',
      id: docRef.id,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error registering driver or creating Driver',
      error: error.message,
    });
  }
};


exports.getDriverDetails = async (req, res) => {
    const { email } = req.query;  // Get email from query parameters
    
    try {
      // Fetch Driver details from Firestore
      const driverSnapshot = await db.collection('driver').where('email', '==', email).get();
      
      if (driverSnapshot.empty) {
        return res.status(404).json({ message: 'Driver not found' });
      }
      
      const driverData = driverSnapshot.docs[0].data();  // Assuming one driver per email
      res.status(200).json({ driver: driverData });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching driver details', error });
    }
  };
  