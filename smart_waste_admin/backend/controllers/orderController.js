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

exports.getAllOrderDetails = async (req, res) => {
    try {
        // Fetch all Driver details from Firestore
        const orderSnapshot = await db.collection('orders').get();
    
        if (orderSnapshot.empty) {
          return res.status(404).json({ message: 'No Orders found' });
        }
    
        // Map through the snapshot and collect the data for all drivers
        const ordersData = orderSnapshot.docs.map(doc => ({
          id: doc.id,  // Include the document ID for reference
          ...doc.data()  // Spread the document data
        }));
    
        res.status(200).json({ orders: ordersData });
      } catch (error) {
        res.status(500).json({ message: 'Error fetching driver details', error });
      }
  };