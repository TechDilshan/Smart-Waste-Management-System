import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
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

  // Variables for user data and loading state
  Map<String, dynamic>? userData;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchUserData(); // Fetch user data when the page loads
  }

  // Function to fetch user data from Firestore
  Future<void> _fetchUserData() async {
    String? userEmail = FirebaseAuth.instance.currentUser?.email;

    if (userEmail != null) {
      QuerySnapshot snapshot = await FirebaseFirestore.instance
          .collection('users')
          .where('email', isEqualTo: userEmail)
          .get();

      if (snapshot.docs.isNotEmpty) {
        setState(() {
          userData = snapshot.docs.first.data() as Map<String, dynamic>?;
          isLoading = false;
        });
      } else {
        setState(() {
          isLoading = false;
        });
      }
    } else {
      setState(() {
        isLoading = false;
      });
    }
  }

  // Function to add a new payment to Firebase
  void _makePayment() async {
    if (_priceController.text.isNotEmpty &&
        _dateController.text.isNotEmpty &&
        _summaryController.text.isNotEmpty) {
      String userEmail = FirebaseAuth.instance.currentUser!.email!;
      await FirebaseFirestore.instance.collection('payments').add({
        'price': _priceController.text,
        'date': _dateController.text,
        'summary': _summaryController.text,
        'userEmail': userEmail,
        'timestamp': FieldValue.serverTimestamp(),
      });

      _priceController.clear();
      _dateController.clear();
      _summaryController.clear();

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

  // Function to delete a payment by document ID
  void _deletePayment(String paymentId) async {
    await FirebaseFirestore.instance.collection('payments').doc(paymentId).delete();
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text('Payment Deleted'),
      duration: Duration(seconds: 2),
    ));
  }

  @override
  Widget build(BuildContext context) {
    String userEmail = FirebaseAuth.instance.currentUser?.email ?? '';

    return Scaffold(
      appBar: AppBar(
        title: Text('Payment Details'),
        backgroundColor: Colors.green,
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  if (userData != null)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 16.0),
                      child: Text(
                        'Welcome, ${userData!['name'] ?? 'User'}',
                        style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                      ),
                    ),
                  // Input fields for price, date, and summary
                  _buildInputField(_priceController, 'Enter Price', TextInputType.number),
                  _buildInputField(
                    _dateController,
                    'Select Date',
                    TextInputType.datetime,
                    onTap: () async {
                      FocusScope.of(context).requestFocus(FocusNode()); // Dismiss the keyboard
                      DateTime? selectedDate = await showDatePicker(
                        context: context,
                        initialDate: DateTime.now(),
                        firstDate: DateTime(2000),
                        lastDate: DateTime(2101),
                      );

                      if (selectedDate != null) {
                        setState(() {
                          _dateController.text = "${selectedDate.toLocal()}".split(' ')[0]; // Format the date as YYYY-MM-DD
                        });
                      }
                    },
                  ),
                  _buildInputField(
                    _summaryController,
                    'Enter Summary',
                    TextInputType.multiline,
                    maxLines: 3,
                  ),
                  SizedBox(height: 16),
                  // "Make Payment" button at the bottom
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      padding: EdgeInsets.symmetric(vertical: 16),
                    ),
                    onPressed: _makePayment,
                    child: Text(
                      'Make Payment',
                      style: TextStyle(fontSize: 16, color: Colors.white),
                    ),
                  ),
                  SizedBox(height: 20),
                  // Payment details list from Firebase (filtered by email)
                  Expanded(
                    child: StreamBuilder<QuerySnapshot>(
                      stream: FirebaseFirestore.instance
                          .collection('payments')
                          .where('userEmail', isEqualTo: userEmail)
                          .snapshots(),
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
                                trailing: IconButton(
                                  icon: Icon(Icons.delete, color: Colors.black),
                                  onPressed: () {
                                    _deletePayment(payment.id);
                                  },
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
            ),
    );
  }

  Widget _buildInputField(TextEditingController controller, String label, TextInputType keyboardType, {int maxLines = 1, VoidCallback? onTap}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10.0),
      child: TextField(
        controller: controller,
        decoration: InputDecoration(
          labelText: label,
          border: OutlineInputBorder(),
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(color: Colors.blueAccent, width: 2.0),
          ),
          enabledBorder: OutlineInputBorder(
            borderSide: BorderSide(color: Colors.grey, width: 1.0),
          ),
        ),
        keyboardType: keyboardType,
        maxLines: maxLines,
        onTap: onTap, // Trigger onTap event
      ),
    );
  }
}
