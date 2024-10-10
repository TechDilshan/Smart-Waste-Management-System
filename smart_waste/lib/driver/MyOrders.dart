import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

class MyOrdersPage extends StatelessWidget {
  final String driverEmail; // The email passed from the login page

  // Constructor to receive the logged-in driver's email
  MyOrdersPage({required this.driverEmail});

  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  Future<List<Map<String, dynamic>>> _getOrders() async {
    // Query the 'selectedOrders' collection for orders related to the logged-in driver
    QuerySnapshot ordersSnapshot = await _firestore
        .collection('selectedOrders')
        .where('driverEmail', isEqualTo: driverEmail)
        .get();

    // Convert the documents into a list of orders
    List<Map<String, dynamic>> orders = ordersSnapshot.docs
        .map((doc) => doc.data() as Map<String, dynamic>)
        .toList();

    return orders;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Orders'),
        backgroundColor: Colors.deepPurple,
      ),
      body: FutureBuilder<List<Map<String, dynamic>>>(
        future: _getOrders(), // Fetch orders from Firestore
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            // Display a loading spinner while the data is being fetched
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            // Display an error message if something goes wrong
            return const Center(child: Text('Error fetching orders.'));
          }

          if (!snapshot.hasData || snapshot.data!.isEmpty) {
            // Display a message if no orders are found
            return const Center(child: Text('No orders found.'));
          }

          // If data is successfully fetched, display the list of orders
          List<Map<String, dynamic>> orders = snapshot.data!;

          return ListView.builder(
            itemCount: orders.length,
            itemBuilder: (context, index) {
              // Display each order's information
              Map<String, dynamic> order = orders[index];
              return ListTile(
                title: Text('Order ID: ${order['orderId'] ?? 'N/A'}'),
                subtitle: Text('Order Details: ${order['orderDetails'] ?? 'N/A'}'),
                trailing: Text('Status: ${order['status'] ?? 'N/A'}'),
              );
            },
          );
        },
      ),
    );
  }
}
