const { db } = require('../firebaseAdmin');
const SelectedOrder = require('../models/serOrderModel');

// Save selected order with driver and customer emails
exports.saveSelectedOrder = async (req, res) => {
  const { customerEmail, driverEmail, orderDetails } = req.body;
  
  try {
    const currentDate = new Date().toISOString();
    
    // Create a new SelectedOrder instance
    const selectedOrder = new SelectedOrder(customerEmail, driverEmail, orderDetails, currentDate);
    
    // Save the selectedOrder object to Firestore
    const docRef = await db.collection('selectedOrders').add({
      customerEmail: selectedOrder.customerEmail,
      driverEmail: selectedOrder.driverEmail,
      orderDetails: selectedOrder.orderDetails,
      date: selectedOrder.date,
    });

    // Respond with success message and document ID
    res.status(200).json({
      message: 'Order saved successfully with selected driver',
      id: docRef.id,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      message: 'Error saving order',
      error: error.message,
    });
  }
};
