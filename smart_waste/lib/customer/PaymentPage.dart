import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

class PaymentPage extends StatefulWidget {
  @override
  _PaymentPageState createState() => _PaymentPageState();
}

class _PaymentPageState extends State<PaymentPage> {
  // Controllers for input fields
  final TextEditingController _priceController = TextEditingController();
  final TextEditingController _dateController = TextEditingController();
  final TextEditingController _summaryController = TextEditingController();

  // Function to add a new payment to Firebase
  void _makePayment() async {
    if (_priceController.text.isNotEmpty &&
        _dateController.text.isNotEmpty &&
        _summaryController.text.isNotEmpty) {
      await FirebaseFirestore.instance.collection('payments').add({
        'price': _priceController.text,
        'date': _dateController.text,
        'summary': _summaryController.text,
        'timestamp': FieldValue.serverTimestamp(), // Add timestamp for ordering
      });

      // Clear the input fields
      _priceController.clear();
      _dateController.clear();
      _summaryController.clear();

      // Show a success message
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('Payment Submitted Successfully'),
        duration: Duration(seconds: 2),
      ));
    } else {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('Please fill all fields'),
        duration: Duration(seconds: 2),
      ));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Payment Details'),
      ),
      body: Column(
        children: [
          // "Make Payment" button
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: ElevatedButton(
              onPressed: () {
                _makePayment();
              },
              child: Text('Make Payment'),
            ),
          ),
          // Input fields for price, date, and summary
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Column(
              children: [
                TextField(
                  controller: _priceController,
                  decoration: InputDecoration(labelText: 'Enter Price'),
                  keyboardType: TextInputType.number,
                ),
                SizedBox(height: 10),
                TextField(
                  controller: _dateController,
                  decoration: InputDecoration(labelText: 'Enter Date'),
                  keyboardType: TextInputType.datetime,
                ),
                SizedBox(height: 10),
                TextField(
                  controller: _summaryController,
                  decoration: InputDecoration(labelText: 'Enter Summary'),
                  maxLines: 3,
                ),
                SizedBox(height: 20),
              ],
            ),
          ),
          // Payment details list from Firebase
          Expanded(
            child: StreamBuilder<QuerySnapshot>(
              stream: FirebaseFirestore.instance.collection('payments').orderBy('timestamp', descending: true).snapshots(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return Center(child: CircularProgressIndicator());
                }

                if (snapshot.hasError) {
                  return Center(child: Text('Something went wrong'));
                }

                if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
                  return Center(child: Text('No payments found'));
                }

                // Display payments in a list
                var paymentDocs = snapshot.data!.docs;
                return ListView.builder(
                  itemCount: paymentDocs.length,
                  itemBuilder: (context, index) {
                    var payment = paymentDocs[index];
                    return Card(
                      margin: EdgeInsets.symmetric(vertical: 5, horizontal: 10),
                      child: ListTile(
                        title: Text('Price: ${payment['price']}'),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Date: ${payment['date']}'),
                            Text('Summary: ${payment['summary']}'),
                          ],
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
