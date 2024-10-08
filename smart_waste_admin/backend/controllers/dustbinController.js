const { db } = require('../firebaseAdmin');
const Dustbin = require('../models/dustbinModel');

// Create and Save Dustbin
exports.registerDustbin = async (req, res) => {
  const { location, capacity, areaCode } = req.body;

  // Create a new Dustbin instance
  const dustbin = new Dustbin(location, capacity, areaCode);

  try {
    // Save the Dustbin data to Firestore
    const docRef = await db.collection('dustbins').add({
      location: dustbin.location,
      capacity: dustbin.capacity,
      areaCode: dustbin.areaCode,
    });

    // Return the generated Firestore document ID (used for QR code generation)
    res.status(200).json({ message: 'Dustbin registered successfully', id: docRef.id });
  } catch (error) {
    res.status(500).json({ message: 'Error registering dustbin', error });
  }
};
