import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'RequestPage.dart'; // Import the request page
import 'PaymentPage.dart'; // Import the payment page

class CustomerHome extends StatefulWidget {
  @override
  _CustomerHomeState createState() => _CustomerHomeState();
}

class _CustomerHomeState extends State<CustomerHome> {
  // Controller for email input
  final TextEditingController _emailController = TextEditingController();
  String _email = "";
  String _myPoints = "0";
  String _noItems = "0";
  bool _isLoading = false;
  bool _dataFound = false;

  // Function to fetch customer data based on the email entered
  void _fetchCustomerData() async {
    if (_email.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('Please enter an email address.'),
        duration: Duration(seconds: 2),
      ));
      return;
    }

    setState(() {
      _isLoading = true;
      _dataFound = false;
    });

    try {
      // Fetch customer data from Firestore where email matches
      var customerSnapshot = await FirebaseFirestore.instance
          .collection('customer')
          .where('email', isEqualTo: _email)
          .limit(1)
          .get();

      if (customerSnapshot.docs.isNotEmpty) {
        var customerData = customerSnapshot.docs.first.data();
        setState(() {
          _myPoints = customerData['myPoints']?.toString() ?? '0';
          _noItems = customerData['noItems']?.toString() ?? '0';
          _dataFound = true;
        });
      } else {
        setState(() {
          _myPoints = "0";
          _noItems = "0";
          _dataFound = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text('No customer data found for this email.'),
          duration: Duration(seconds: 2),
        ));
      }
    } catch (e) {
      setState(() {
        _dataFound = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('Error fetching customer data: $e'),
        duration: Duration(seconds: 2),
      ));
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Smart Waste Management'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Email input field
            TextField(
              controller: _emailController,
              decoration: InputDecoration(
                labelText: 'Enter your Email',
                border: OutlineInputBorder(),
              ),
              onChanged: (value) {
                setState(() {
                  _email = value;
                });
              },
            ),
            SizedBox(height: 20),

            // Button to fetch customer data
            ElevatedButton(
              onPressed: _fetchCustomerData,
              child: _isLoading
                  ? CircularProgressIndicator(color: Colors.white)
                  : Text('Fetch Data'),
            ),
            SizedBox(height: 20),

            // Display customer data if email is valid
            if (_isLoading) ...[
              CircularProgressIndicator(),
            ] else if (_dataFound) ...[
              // My Points Box
              Container(
                margin: EdgeInsets.symmetric(vertical: 10),
                padding: EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.blueAccent,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Column(
                  children: [
                    Text(
                      'My Points',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 10),
                    Text(
                      _myPoints,
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
              // No Items Box
              Container(
                margin: EdgeInsets.symmetric(vertical: 10),
                padding: EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.greenAccent,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Column(
                  children: [
                    Text(
                      'No Items',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 10),
                    Text(
                      _noItems,
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ] else if (!_dataFound) ...[
              Text(
                'No data found for this email.',
                style: TextStyle(color: Colors.red, fontSize: 16),
              ),
            ],
            SizedBox(height: 20),

            // Request Garbage Collection Button
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => RequestPage()),
                );
              },
              child: Text('Request Garbage Collection'),
            ),
            SizedBox(height: 20), // Add some space between the buttons
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => PaymentPage()),
                );
              },
              child: Text('Make a Payment'),
            ),
          ],
        ),
      ),
    );
  }
}
