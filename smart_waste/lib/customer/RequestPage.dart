import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

class RequestPage extends StatefulWidget {
  @override
  _RequestPageState createState() => _RequestPageState();
}

class _RequestPageState extends State<RequestPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _recycleWasteController = TextEditingController();
  final TextEditingController _organicWasteController = TextEditingController();
  final TextEditingController _generalWasteController = TextEditingController();
  
  // Variables for map location
  LatLng _selectedLocation = LatLng(6.9271, 79.8612); // Default location (Colombo)
  String _locationText = "Tap on map to select a location";

  // Function to save the form data to Firebase
  Future<void> _submitForm() async {
    if (_formKey.currentState!.validate()) {
      try {
        // Get the logged-in user's email
        String? userEmail = FirebaseAuth.instance.currentUser?.email;

        if (userEmail == null) {
          throw Exception('User is not logged in');
        }

        // Add form data along with the logged-in user's email and the selected location to Firestore
        await FirebaseFirestore.instance.collection('orders').add({
          'name': _nameController.text,
          'recycleWastePercentage': double.parse(_recycleWasteController.text),
          'organicWastePercentage': double.parse(_organicWasteController.text),
          'generalWastePercentage': double.parse(_generalWasteController.text),
          'email': userEmail, // Add user's email to Firestore
          'location': {
            'latitude': _selectedLocation.latitude,
            'longitude': _selectedLocation.longitude,
          }, // Store the latitude and longitude
          'timestamp': FieldValue.serverTimestamp(),
        });

        // Show success message and navigate back
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Request submitted successfully!')),
        );
        Navigator.pop(context);
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to submit request: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Request Garbage Collection'),
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: <Widget>[
              TextFormField(
                controller: _nameController,
                decoration: InputDecoration(labelText: 'Enter your name'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your name';
                  }
                  return null;
                },
              ),
              TextFormField(
                controller: _recycleWasteController,
                decoration: InputDecoration(labelText: 'Enter Recycle Waste Percentage'),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter recycle waste percentage';
                  }
                  return null;
                },
              ),
              TextFormField(
                controller: _organicWasteController,
                decoration: InputDecoration(labelText: 'Enter Organic Waste Percentage'),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter organic waste percentage';
                  }
                  return null;
                },
              ),
              TextFormField(
                controller: _generalWasteController,
                decoration: InputDecoration(labelText: 'Enter General Waste Percentage'),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter general waste percentage';
                  }
                  return null;
                },
              ),
              SizedBox(height: 20),
              
              // Map section to select location
              Container(
                height: 300,
                child: FlutterMap(
                  options: MapOptions(
                    center: _selectedLocation, // The center of the map (initially set to Colombo)
                    zoom: 13.0,
                    onTap: (_, newLatLng) {
                      setState(() {
                        _selectedLocation = newLatLng;
                        _locationText = "Location Selected: ${_selectedLocation.latitude}, ${_selectedLocation.longitude}";
                      });
                    },
                  ),
                  children: [
                    TileLayer(
                      urlTemplate: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                      subdomains: ['a', 'b', 'c'],
                    ),
                    MarkerLayer(
                      markers: [
                        Marker(
                          point: _selectedLocation,
                          builder: (ctx) => Icon(Icons.location_on, color: Colors.red, size: 40),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              
              // Display selected location coordinates
              Text(
                _locationText,
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),

              SizedBox(height: 20),

              // Submit Button
              ElevatedButton(
                onPressed: _submitForm,
                child: Text('Submit Request'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
