import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'signup.dart'; // Import the signup screen
import './customer/CustomerHome.dart'; // Import the home screen
import 'driver/DriverHome.dart';


class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final FirebaseAuth _auth = FirebaseAuth.instance;
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

      UserCredential userCredential = await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );

      // Navigate to the next screen after successful login
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => CustomerHome()), // Replace with your home screen
      );
    } on FirebaseAuthException catch (e) {
      setState(() {
        if (e.code == 'user-not-found') {
          _errorMessage = 'No user found for that email.';
        } else if (e.code == 'wrong-password') {
          _errorMessage = 'Wrong password provided for that user.';
        } else {
          _errorMessage = 'An error occurred. Please try again.';
        }
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'An unexpected error occurred. Please try again.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Color(0xFFA4F3F2),
              Color(0xFF86A8E7),
              Color(0xFF7F7FD5),
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
                const SizedBox(height: 40),
                // Login Container
                Container(
                  padding: const EdgeInsets.all(20),
                  margin: const EdgeInsets.symmetric(horizontal: 20), // Add left and right margin
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.25),
                    borderRadius: BorderRadius.circular(15),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Login Topic
                      const Text(
                        'Login',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 20),
                      // Email Input Field
                      TextField(
                        controller: _emailController,
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: Colors.white.withOpacity(0.5),
                          hintText: 'Email',
                          prefixIcon: const Icon(Icons.email, color: Colors.white),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        style: const TextStyle(color: Colors.white),
                        keyboardType: TextInputType.emailAddress,
                      ),
                      const SizedBox(height: 20),
                      // Password Input Field
                      TextField(
                        controller: _passwordController,
                        obscureText: !_isPasswordVisible,
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: Colors.white.withOpacity(0.5),
                          hintText: 'Password',
                          prefixIcon: const Icon(Icons.lock, color: Colors.white),
                          suffixIcon: IconButton(
                            icon: Icon(
                              _isPasswordVisible
                                  ? Icons.visibility
                                  : Icons.visibility_off,
                              color: Colors.white,
                            ),
                            onPressed: () {
                              setState(() {
                                _isPasswordVisible = !_isPasswordVisible;
                              });
                            },
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        style: const TextStyle(color: Colors.white),
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
                            backgroundColor: const Color.fromARGB(255, 125, 44, 176),
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
                      const SizedBox(height: 20),
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
                            "",
                            style: TextStyle(color: Colors.white),
                          ),
                        ),
                      ),

                      Center(
                        child: TextButton(
                          onPressed: () {
                            Navigator.pushReplacement(
                              context,
                              MaterialPageRoute(builder: (context) => const DriverHome()),
                            );
                          },
                          child: const Text(
                            "Are you admin? Login",
                            style: TextStyle(color: Colors.white),
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
}
