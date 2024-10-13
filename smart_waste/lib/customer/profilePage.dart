import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../login.dart'; // Import your login page here

class ProfilePage extends StatefulWidget {
  @override
  _ProfilePageState createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  Map<String, dynamic>? userData;
  bool isLoading = true; // Track loading state

  @override
  void initState() {
    super.initState();
    // Fetch user data when the widget initializes
    _fetchUserData();
  }

  Future<void> _fetchUserData() async {
    try {
      // Get the current user's email
      String? userEmail = FirebaseAuth.instance.currentUser?.email;

      // Check if userEmail is not null
      if (userEmail != null) {
        // Fetch user data from Firestore using QuerySnapshot
        QuerySnapshot snapshot = await FirebaseFirestore.instance
            .collection('users') // Replace with your Firestore collection name
            .where('email', isEqualTo: userEmail) // Assuming 'email' is the field name
            .get();

        // Check if any documents are returned
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
      } else {
        print('No user is currently signed in');
        setState(() {
          isLoading = false; // Set loading to false if no user is signed in
        });
      }
    } catch (e) {
      print('Error fetching user data: $e');
      setState(() {
        isLoading = false; // Set loading to false on error
      });
    }
  }

  Future<void> _logout() async {
    try {
      await FirebaseAuth.instance.signOut(); // Sign out from Firebase
      Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (context) => LoginScreen())); // Navigate to login page
    } catch (e) {
      print('Error logging out: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Profile"),
        backgroundColor: Colors.green,
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.lightGreen[100]!, Colors.white],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
              ),
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    // Profile Picture
                    _buildProfilePicture(),
                    SizedBox(height: 20), // Space after profile picture
                    // User Email Display
                    Text(
                      "Current Email: ${FirebaseAuth.instance.currentUser?.email ?? 'N/A'}",
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.black87),
                    ),
                    SizedBox(height: 20), // Add some space
                    // User Info Cards
                    _buildUserInfoCard("Name: ${userData?['name'] ?? 'N/A'}"),
                    _buildUserInfoCard("NIC: ${userData?['NIC'] ?? 'N/A'}"),
                    _buildUserInfoCard("Location: ${userData?['location'] ?? 'N/A'}"),
                    _buildUserInfoCard("My Points: ${userData?['myPoints'] ?? 'N/A'}"),
                    _buildUserInfoCard("Number of Items Recycled: ${userData?['noItems'] ?? 'N/A'}"),
                    _buildUserInfoCard("Phone: ${userData?['phone'] ?? 'N/A'}"),
                    SizedBox(height: 20), // Space before the button
                    // Logout Button
                    // Logout Button
                    ElevatedButton(
                      onPressed: _logout,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color.fromARGB(255, 2, 63, 25), // Button background color
                        padding: EdgeInsets.symmetric(horizontal: 40, vertical: 15), // Button padding
                      ),
                      child: Text(
                        "Logout",
                        style: TextStyle(fontSize: 18, color: Colors.white), // Change text color here
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildProfilePicture() {
    // Replace 'profilePictureUrl' with the actual URL or path from your Firestore data
    String profilePictureUrl = userData?['profilePictureUrl'] ?? 'https://via.placeholder.com/150'; // Placeholder image URL

    return Container(
      width: double.infinity, // Full width
      child: CircleAvatar(
        radius: 60,
        backgroundImage: NetworkImage(profilePictureUrl), // Load the image from URL
        backgroundColor: Colors.grey[200], // Background color if the image fails to load
      ),
    );
  }

  Widget _buildUserInfoCard(String text) {
    return Container(
      width: double.infinity, // Full width for the card
      margin: EdgeInsets.symmetric(vertical: 10, horizontal: 16), // Adjusted margin for better spacing
      child: Card(
        elevation: 5,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Text(
            text,
            style: TextStyle(fontSize: 18, color: Colors.black87),
          ),
        ),
      ),
    );
  }
}
