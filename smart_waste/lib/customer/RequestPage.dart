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

  // Variables for waste weights
  double _recycleWasteWeight = 1; // Minimum 1 kg
  double _organicWasteWeight = 1; // Minimum 1 kg
  double _generalWasteWeight = 1; // Minimum 1 kg

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
          'recycleWasteWeight': _recycleWasteWeight,
          'organicWasteWeight': _organicWasteWeight,
          'generalWasteWeight': _generalWasteWeight,
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
        backgroundColor: Colors.green[600],
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: <Widget>[
              TextFormField(
                controller: _nameController,
                decoration: InputDecoration(
                  labelText: 'Enter your name',
                  border: OutlineInputBorder(),
                  filled: true,
                  fillColor: Colors.grey[200],
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your name';
                  }
                  return null;
                },
              ),
              SizedBox(height: 20),

              // Recycle Waste Slider
              _buildWasteSlider(
                'Recycle Waste (kg)',
                _recycleWasteWeight,
                (newValue) {
                  setState(() {
                    _recycleWasteWeight = newValue;
                  });
                },
              ),
              SizedBox(height: 20),

              // Organic Waste Slider
              _buildWasteSlider(
                'Organic Waste (kg)',
                _organicWasteWeight,
                (newValue) {
                  setState(() {
                    _organicWasteWeight = newValue;
                  });
                },
              ),
              SizedBox(height: 20),

              // General Waste Slider
              _buildWasteSlider(
                'General Waste (kg)',
                _generalWasteWeight,
                (newValue) {
                  setState(() {
                    _generalWasteWeight = newValue;
                  });
                },
              ),
              SizedBox(height: 20),

              // Map section to select location
              Container(
                height: 300,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.5),
                      spreadRadius: 2,
                      blurRadius: 5,
                      offset: Offset(0, 3),
                    ),
                  ],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(12),
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
                style: ElevatedButton.styleFrom(
                  foregroundColor: Colors.white, backgroundColor: Colors.green[600], // Text color
                ),
                child: Text('Submit Request'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildWasteSlider(String label, double currentValue, ValueChanged<double> onChanged) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        Slider(
          value: currentValue,
          min: 1,
          max: 10,
          divisions: 9,
          label: currentValue.round().toString() + ' kg',
          onChanged: onChanged,
          activeColor: const Color.fromARGB(255, 15, 84, 19), // Change this to your desired active color
          inactiveColor: Colors.grey[300],
        ),
        Text(
          'Weight: ${currentValue.toStringAsFixed(1)} kg',
          style: TextStyle(fontSize: 16),
        ),
      ],
    );
  }
}
