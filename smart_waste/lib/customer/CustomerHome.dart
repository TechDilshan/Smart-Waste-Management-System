import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart'; // Import Firestore
import 'package:smart_waste/customer/PaymentPage.dart';
import 'package:smart_waste/customer/ProfilePage.dart'; // Import ProfilePage
import 'package:smart_waste/customer/RequestPage.dart';

class CustomerHome extends StatefulWidget {
  @override
  _CustomerHomeState createState() => _CustomerHomeState();
}

class _CustomerHomeState extends State<CustomerHome> {
  String address = "Loading..."; // Initial loading text
  String profileImage = 'https://example.com/profile-image.png'; // Replace with your image URL
  String co2Saved = "800 g";
  String points = "Loading..."; // Initial loading text
  String itemsRecycled = "Loading..."; // Initial loading text
  Map<String, dynamic>? userData; // Store user data fetched from Firestore
  bool isLoading = true; // Loading state for fetching user data

  int _selectedIndex = 0; // Track the selected index for BottomNavigationBar

  @override
  void initState() {
    super.initState();
    _fetchUserDetails(); // Fetch user details when the widget is initialized
  }

  Future<void> _fetchUserDetails() async {
    String? userEmail = FirebaseAuth.instance.currentUser?.email;

    // Check if userEmail is not null
    if (userEmail != null) {
      // Fetch user data from Firestore using QuerySnapshot
      QuerySnapshot snapshot = await FirebaseFirestore.instance
          .collection('users') // Replace with your Firestore collection name
          .where('email', isEqualTo: userEmail) // Assuming 'email' is the field name
          .get();

      if (snapshot.docs.isNotEmpty) {
        setState(() {
          userData = snapshot.docs.first.data() as Map<String, dynamic>?; // Get the first document
          isLoading = false; // Set loading to false once data is fetched
        });
      } else {
        print('No user document found for the current user');
        setState(() {
          isLoading = false; // Set loading to false if no user document is found
        });
      }

      // Ensure userData is not null before accessing its properties
      if (userData != null) {
        // Update state with user details
        setState(() {
          address = userData!['location'] ?? "No address"; // Use null-aware operator
          points = userData!['myPoints']?.toString() ?? "0"; // Convert to string
          co2Saved = userData!['name']?.toString() ?? "no"; // Convert to string
          itemsRecycled = userData!['noItems']?.toString() ?? "0"; // Convert to string
        });
      }
    } else {
      setState(() {
        isLoading = false; // Set loading to false if userEmail is null
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    // Get the logged-in user's email safely
    String userEmail = FirebaseAuth.instance.currentUser?.email ?? 'No email'; // Use null-aware operator and provide a default

    return Scaffold(
      appBar: AppBar(
        title: Text("Smart Waste Management"),
        backgroundColor: Colors.green,
      ),
      body: _getBodyContent(context), // Get body content based on selected index
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: Colors.green,
        selectedItemColor: Colors.white,
        unselectedItemColor: Colors.black54,
        currentIndex: _selectedIndex,
        onTap: (index) {
          setState(() {
            _selectedIndex = index; // Update selected index
          });
          _onItemTapped(index, context); // Handle navigation
        },
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.credit_card),
            label: 'Payment',
          ),
        ],
      ),
    );
  }

  Widget _getBodyContent(BuildContext context) {
    if (_selectedIndex == 0) {
      return _buildHomeContent(context); // Return Home content
    } else if (_selectedIndex == 1) {
      return ProfilePage(); // Return Profile Page
    } else {
      return PaymentPage(); // Return Payment Page
    }
  }

  Widget _buildHomeContent(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Address and profile section
          Container(
            color: Colors.green,
            padding: EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(Icons.location_on, color: Colors.white),
                    Text(
                      address,
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                CircleAvatar(
                  backgroundImage: NetworkImage(profileImage),
                  radius: 30,
                ),
              ],
            ),
          ),

          // CO2 Saved section
          Container(
            margin: EdgeInsets.all(16),
            padding: EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.lightGreen,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Column(
              children: [
                Text(
                  "Current Email: ${FirebaseAuth.instance.currentUser?.email ?? 'No email'}", // Use null-aware operator and provide a default
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.black87),
                ),
                Text(
                  'Welcome '+co2Saved,
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
                SizedBox(height: 5),
                Text(
                  'CO2 Saved',
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.black,
                  ),
                ),
              ],
            ),
          ),

          // Points and Items Recycled section
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildStatCard('My Points', points, Colors.lightGreen),
                _buildStatCard('Items Recycled', itemsRecycled, Colors.lightGreen),
              ],
            ),
          ),

          // Request Garbage Collection section
          GestureDetector(
            onTap: () {
              // Navigate to Request Page
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => RequestPage()),
              );
            },
            child: Container(
              margin: EdgeInsets.all(16),
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.lightGreen,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Request Garbage Collection',
                    style: TextStyle(fontSize: 16, color: Colors.black),
                  ),
                  SizedBox(height: 5),
                  Text(
                    'Tap here to submit a request',
                    style: TextStyle(fontSize: 12, color: Colors.black54),
                  ),
                  Align(
                    alignment: Alignment.centerRight,
                    child: Icon(
                      Icons.arrow_forward_ios,
                      color: Colors.black,
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Make Payment section
          GestureDetector(
            onTap: () {
              // Navigate to PaymentPage
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => PaymentPage(),
                ),
              );
            },
            child: Container(
              margin: EdgeInsets.all(16),
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.lightGreen,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Make Payment for your recycling service',
                    style: TextStyle(fontSize: 16, color: Colors.black),
                  ),
                  Align(
                    alignment: Alignment.centerRight,
                    child: Icon(
                      Icons.arrow_forward_ios,
                      color: Colors.black,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Handle navigation based on the selected index
  void _onItemTapped(int index, BuildContext context) {
    if (index == 0) {
      // Home is already displayed
    } else if (index == 1) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => ProfilePage()), // Navigate to ProfilePage
      );
    } else if (index == 2) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => PaymentPage()), // Navigate to PaymentPage
      );
    }
  }

  // Helper method to create stat cards
  Widget _buildStatCard(String title, String value, Color color) {
    return Container(
      width: MediaQuery.of(context).size.width * 0.4,
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(fontSize: 16, color: Colors.black),
          ),
          Text(
            value,
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.black),
          ),
        ],
      ),
    );
  }
}
