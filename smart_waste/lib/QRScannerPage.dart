// import 'package:flutter/material.dart';
// import 'package:cloud_firestore/cloud_firestore.dart';
// import 'package:mobile_scanner/mobile_scanner.dart';

// class QRScannerPage extends StatefulWidget {
//   @override
//   _QRScannerPageState createState() => _QRScannerPageState();
// }

// class _QRScannerPageState extends State<QRScannerPage> {
//   String? result;

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: Text('QR Scanner')),
//       body: MobileScanner(
//         // onDetect callback is triggered when a barcode is detected
//         onDetect: (barcode) async {
//           setState(() {
//             result = barcode.rawValue; // Store the scanned value
//           });

//           if (result != null) {
//             // Retrieve dustbin data from Firestore
//             DocumentSnapshot docSnapshot = await FirebaseFirestore.instance
//                 .collection('dustbins')
//                 .doc(result)
//                 .get();

//             if (docSnapshot.exists) {
//               Map<String, dynamic> data = docSnapshot.data() as Map<String, dynamic>;
//               Navigator.push(
//                 context,
//                 MaterialPageRoute(
//                   builder: (context) => DustbinDetailsPage(data: data),
//                 ),
//               );
//             } else {
//               // Optionally handle the case where the document does not exist
//               ScaffoldMessenger.of(context).showSnackBar(
//                 SnackBar(content: Text('Dustbin not found.')),
//               );
//             }
//           }
//         },
//       ),
//     );
//   }
// }

// extension on BarcodeCapture {
//   String? get rawValue => null;
// }

// class DustbinDetailsPage extends StatelessWidget {
//   final Map<String, dynamic> data;

//   DustbinDetailsPage({required this.data});

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: Text('Dustbin Details')),
//       body: Padding(
//         padding: EdgeInsets.all(16.0),
//         child: Column(
//           crossAxisAlignment: CrossAxisAlignment.start,
//           children: [
//             Text('Location: ${data['location']}'),
//             Text('Capacity: ${data['capacity']}'),
//             Text('Area Code: ${data['areaCode']}'),
//           ],
//         ),
//       ),
//     );
//   }
// }
