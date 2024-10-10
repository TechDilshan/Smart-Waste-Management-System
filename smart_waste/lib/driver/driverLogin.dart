import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import '../signup.dart'; // Import the signup screen
import 'DriverHome.dart';
import '../login.dart'; // Import the user login screen

class DriverLoginScreen extends StatefulWidget {
  const DriverLoginScreen({super.key});

  @override
  _DriverLoginScreenState createState() => _DriverLoginScreenState();
}

class _DriverLoginScreenState extends State<DriverLoginScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  bool _isPasswordVisible = false;
  String? _errorMessage;

  Future<void> _login() async {
  setState(() {
    _errorMessage = null; // Clear previous error message
  });

  try {
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();

    if (email.isEmpty || password.isEmpty) {
      setState(() {
        _errorMessage = 'Please enter both email and password.';
      });
      return;
    }

    // Query Firestore to find driver with matching email
    QuerySnapshot driverSnapshot = await _firestore
        .collection('driver')
        .where('email', isEqualTo: email)
        .limit(1) // Limit to one document
        .get();

    if (driverSnapshot.docs.isEmpty) {
      setState(() {
        _errorMessage = 'No driver found with this email.';
      });
      return;
    }

    // Check if the password matches
    var driverData = driverSnapshot.docs.first.data() as Map<String, dynamic>;
    if (driverData['Password'] != password) {
      setState(() {
        _errorMessage = 'Incorrect password.';
      });
      return;
    }

    // Navigate to DriverHome page after successful login and pass the email
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) => DriverHome(driverEmail: email), // Pass email
      ),
    );
  } catch (e) {
    setState(() {
      _errorMessage = 'An error occurred. Please try again.';
    });
    print('Error: $e'); // Log the error for debugging
  }
}


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Color(0xFF4E9FCA),
              Color(0xFF71C5E8),
              Color(0xFF4E9FCA),
            ],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: Center(
          child: SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // App Logo
                Image.asset(
                  'assets/logo.png', // Replace with your logo asset path
                  height: 150,
                ),
                const SizedBox(height: 50),
                // Login Container
                Container(
                  padding: const EdgeInsets.all(20),
                  margin: const EdgeInsets.symmetric(horizontal: 20),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.85),
                    borderRadius: BorderRadius.circular(15),
                    boxShadow: const [
                      BoxShadow(
                        color: Colors.black26,
                        offset: Offset(0, 4),
                        blurRadius: 8,
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Login Title
                      const Text(
                        'Driver Login',
                        style: TextStyle(
                          color: Color(0xFF4E9FCA),
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 20),
                      // Email Input Field
                      _buildTextField(
                        controller: _emailController,
                        hintText: 'Email',
                        icon: Icons.email,
                        isPassword: false,
                      ),
                      const SizedBox(height: 15),
                      // Password Input Field
                      _buildTextField(
                        controller: _passwordController,
                        hintText: 'Password',
                        icon: Icons.lock,
                        isPassword: true,
                      ),
                      const SizedBox(height: 20),
                      // Error Message
                      if (_errorMessage != null)
                        Padding(
                          padding: const EdgeInsets.only(bottom: 20),
                          child: Text(
                            _errorMessage!,
                            style: const TextStyle(
                              color: Colors.red,
                              fontSize: 16,
                            ),
                          ),
                        ),
                      // Login Button
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: _login,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF4E9FCA),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                          child: const Text(
                            'Sign In',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 15),
                      // SignUp Prompt
                      Center(
                        child: TextButton(
                          onPressed: () {
                            Navigator.pushReplacement(
                              context,
                              MaterialPageRoute(builder: (context) => const SignUpScreen()),
                            );
                          },
                          child: const Text(
                            "Don't have an account? Sign Up",
                            style: TextStyle(color: Color(0xFF4E9FCA)),
                          ),
                        ),
                      ),
                      Center(
                        child: TextButton(
                          onPressed: () {
                            Navigator.pushReplacement(
                              context,
                              MaterialPageRoute(builder: (context) => const LoginScreen()),
                            );
                          },
                          child: const Text(
                            "Are you a User? Login",
                            style: TextStyle(color: Color(0xFF4E9FCA)),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // Custom TextField with Gradient Borders
  Widget _buildTextField({
    required TextEditingController controller,
    required String hintText,
    required IconData icon,
    required bool isPassword,
  }) {
    return TextField(
      controller: controller,
      obscureText: isPassword ? !_isPasswordVisible : false,
      decoration: InputDecoration(
        filled: true,
        fillColor: Colors.white.withOpacity(0.6),
        hintText: hintText,
        prefixIcon: Icon(icon, color: Color(0xFF4E9FCA)),
        suffixIcon: isPassword
            ? IconButton(
                icon: Icon(
                  _isPasswordVisible ? Icons.visibility : Icons.visibility_off,
                  color: Color(0xFF4E9FCA),
                ),
                onPressed: () {
                  setState(() {
                    _isPasswordVisible = !_isPasswordVisible;
                  });
                },
              )
            : null,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: Color(0xFF4E9FCA), width: 2),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: Color(0xFF4E9FCA), width: 2),
        ),
      ),
      style: const TextStyle(color: Colors.black),
    );
  }
}
