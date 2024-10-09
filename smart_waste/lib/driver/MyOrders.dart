import 'package:flutter/material.dart';

class MyOrdersPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Orders'),
        backgroundColor: Colors.deepPurple,
      ),
      body: Center(
        child: const Text(
          'List of Orders',
          style: TextStyle(fontSize: 24),
        ),
      ),
    );
  }
}
