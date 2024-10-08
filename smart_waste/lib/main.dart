import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'QRScannerPage.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      // Initialize Firebase
      future: Firebase.initializeApp(),
      builder: (context, snapshot) {
        // Check if the future is done (Firebase initialized)
        if (snapshot.connectionState == ConnectionState.done) {
          // Firebase is initialized, show the app
          return MaterialApp(
            title: 'Smart Waste Driver App',
            theme: ThemeData(
              primarySwatch: Colors.blue,
            ),
            home: QRScannerPage(),
          );
        }
        // If the initialization is still ongoing, show a loading indicator
        return MaterialApp(
          home: Scaffold(
            body: Center(
              child: CircularProgressIndicator(), // Loading indicator
            ),
          ),
        );
      },
    );
  }
}
