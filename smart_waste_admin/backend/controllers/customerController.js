// controllers/customerController.js
const { db } = require('../firebaseAdmin');  // Check if this is correct

exports.getUserDetails = async (req, res) => {
  const { email } = req.query;  // Get email from query parameters
  
  try {
    // Fetch user details from Firestore
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    
    if (userSnapshot.empty) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const userData = userSnapshot.docs[0].data();  // Assuming one user per email
    res.status(200).json({ user: userData });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details', error });
  }
};
