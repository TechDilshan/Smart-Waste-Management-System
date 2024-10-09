import 'package:flutter/material.dart';
import 'MyOrders.dart'; // Import MyOrders.dart
import 'QRScannerPage.dart'; // Import QRScannerPage.dart

class DriverHome extends StatelessWidget {
  const DriverHome({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Driver Home'),
        backgroundColor: Colors.deepPurple, // Customize the app bar color
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'Welcome to the Driver Dashboard!',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),
            
            // My Orders Box
            InkWell(
              onTap: () {
                // Navigate to MyOrders page
                Navigator.push(context, MaterialPageRoute(builder: (context) => MyOrdersPage()));
              },
              child: Container(
                width: 200,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.deepPurple,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Center(
                  child: Text(
                    'My Orders',
                    style: TextStyle(
                      fontSize: 18,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),
            
            // Scan QR Code Box
            InkWell(
              onTap: () {
                // Navigate to QRScannerPage
                Navigator.push(context, MaterialPageRoute(builder: (context) => QRScannerPage()));
              },
              child: Container(
                width: 200,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.deepPurple,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Center(
                  child: Text(
                    'Scan QR Code',
                    style: TextStyle(
                      fontSize: 18,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
