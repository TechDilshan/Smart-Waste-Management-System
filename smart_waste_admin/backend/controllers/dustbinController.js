const { db } = require('../firebaseAdmin');
const admin = require('firebase-admin'); // Firebase Admin SDK for Authentication
const Dustbin = require('../models/dustbinModel');

// Create and Save Dustbin and User with Firebase Auth
exports.registerDustbin = async (req, res) => {
  const { email, location, name, phone, NIC, password } = req.body;

  try {
    // 1. Create a user in Firebase Authentication with email and password
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });

    // 2. Create a new Dustbin instance with the provided information
    const dustbin = new Dustbin(email, location, name, phone, NIC, password);

    // 3. Save the Dustbin data to Firestore
    const docRef = await db.collection('users').add({
      email: dustbin.email,
      location: dustbin.location,
      name: dustbin.name,
      phone: dustbin.phone,
      NIC: dustbin.NIC,
      uid: userRecord.uid, // Store Firebase UID
      noItems: 0,
      myPoints: 0,
    });

    // 4. Respond with success and the Firestore document ID
    res.status(200).json({
      message: 'Dustbin registered and user created successfully',
      id: docRef.id,
      firebaseUID: userRecord.uid,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error registering dustbin or creating user',
      error: error.message,
    });
  }
};
