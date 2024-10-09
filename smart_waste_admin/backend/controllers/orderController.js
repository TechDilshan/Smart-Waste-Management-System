// controllers/customerController.js
const { db } = require('../firebaseAdmin');  // Check if this is correct

exports.getOrderDetails = async (req, res) => {
  const { email } = req.query;  // Get email from query parameters
  
  try {
    // Fetch order details from Firestore
    const orderSnapshot = await db.collection('orders').where('email', '==', email).get();
    
    if (orderSnapshot.empty) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const orderData = orderSnapshot.docs[0].data();  // Assuming one order per email
    res.status(200).json({ order: orderData });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order details', error });
  }
};
