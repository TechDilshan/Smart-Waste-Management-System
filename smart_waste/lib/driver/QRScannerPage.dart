import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

class QRScannerPage extends StatefulWidget {
  @override
  _QRScannerPageState createState() => _QRScannerPageState();
}

class _QRScannerPageState extends State<QRScannerPage> {
  Barcode? result;
  bool isScanned = false; // New flag to avoid duplicate processing

  void _onDetect(BarcodeCapture capture) async {
    if (!isScanned) {
      final Barcode? barcode = capture.barcodes.first;
      if (barcode != null && barcode.rawValue != null) {
        setState(() {
          result = barcode;
          isScanned = true; // Set the flag to true after a successful scan
        });

        // Retrieve dustbin data from Firestore
        DocumentSnapshot docSnapshot = await FirebaseFirestore.instance
            .collection('dustbins')
            .doc(result!.rawValue)
            .get();

        if (docSnapshot.exists) {
          Map<String, dynamic> data = docSnapshot.data() as Map<String, dynamic>;
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => DustbinDetailsPage(data: data),
            ),
          ).then((_) {
            setState(() {
              isScanned = false; // Reset the flag after returning from details page
            });
          });
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: <Widget>[
          Expanded(
            flex: 5,
            child: MobileScanner(
              onDetect: _onDetect,
            ),
          ),
          Expanded(
            flex: 1,
            child: Center(
              child: (result != null) ? Text('Scanning Complete') : Text('Scan a code'),
            ),
          )
        ],
      ),
    );
  }
}

class DustbinDetailsPage extends StatelessWidget {
  final Map<String, dynamic> data;

  DustbinDetailsPage({required this.data});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Dustbin Details')),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Location: ${data['location']}'),
            Text('Capacity: ${data['capacity']}'),
            Text('Area Code: ${data['areaCode']}'),
          ],
        ),
      ),
    );
  }
}
