import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart'; // For handling geographic coordinates
import 'MyOrders.dart'; // Import MyOrders.dart
import 'QRScannerPage.dart'; // Import QRScannerPage.dart

class DriverHome extends StatelessWidget {
  final String driverEmail; // Pass email to the home page

  const DriverHome({super.key, required this.driverEmail});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Driver Home'),
        backgroundColor: Colors.deepPurple, // Customize the app bar color
      ),
      body: Column(
        children: [
          Expanded(
            child: DriverLocationMap(driverEmail: driverEmail), // Display the map here
          ),
          const SizedBox(height: 20),
          // My Orders Box
          InkWell(
            onTap: () {
              // Navigate to MyOrders page
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => MyOrdersPage(driverEmail: driverEmail),
                ),
              );
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
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => QRScannerPage(),
                ),
              );
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
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}

class DriverLocationMap extends StatefulWidget {
  final String driverEmail;

  const DriverLocationMap({Key? key, required this.driverEmail}) : super(key: key);

  @override
  _DriverLocationMapState createState() => _DriverLocationMapState();
}

class _DriverLocationMapState extends State<DriverLocationMap> {
  List<DocumentSnapshot> _orders = []; // Store the orders
  bool _isLoading = true; // Loading state

  @override
  void initState() {
    super.initState();
    _fetchOrders(); // Fetch orders from Firestore on initialization
  }

  Future<void> _fetchOrders() async {
    try {
      // Fetch orders where the driverEmail matches the logged-in driver email
      QuerySnapshot snapshot = await FirebaseFirestore.instance
          .collection('selectedOrders') // Your Firestore collection name
          .where('driverEmail', isEqualTo: widget.driverEmail)
          .get();

      setState(() {
        _orders = snapshot.docs; // Set the orders in state
        _isLoading = false; // Set loading to false
      });
    } catch (e) {
      print('Error fetching orders: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return _isLoading
        ? const Center(child: CircularProgressIndicator()) // Display loading indicator while fetching
        : FlutterMap(
            options: MapOptions(
              center: LatLng(6.927079, 79.861244), // Default center: Coordinates of Sri Lanka
              zoom: 12.0,
            ),
            children: [
              TileLayer(
                urlTemplate: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                subdomains: ['a', 'b', 'c'],
                additionalOptions: {
                  'attribution': '© OpenStreetMap contributors',
                },
              ),
              MarkerLayer(
                markers: _orders.map((order) {
                  // Safe check for order data
                  if (order.exists) {
                    final data = order.data() as Map<String, dynamic>?;

                    if (data != null) {
                      // Ensure 'orderDetails' is a Map
                      if (data['orderDetails'] is Map<String, dynamic>) {
                        final orderDetails = data['orderDetails'] as Map<String, dynamic>;

                        // Ensure 'location' is a Map
                        if (orderDetails['location'] is Map<String, dynamic>) {
                          final location = orderDetails['location'] as Map<String, dynamic>;

                          // Get latitude and longitude
                          final lat = location['latitude'] as double?;
                          final lon = location['longitude'] as double?;

                          if (lat != null && lon != null) {
                            print('Latitude: $lat, Longitude: $lon'); // Debug print
                            return Marker(
                              point: LatLng(lat, lon),
                              width: 40.0,
                              height: 40.0,
                              builder: (ctx) => const Icon(
                                Icons.location_on,
                                color: Colors.red,
                                size: 40,
                              ),
                            );
                          }
                        }
                      }
                    }
                  }
                  return null; // Skip if any value is missing
                }).whereType<Marker>().toList(), // Filter out null values
              ),
            ],
          );
  }
}
