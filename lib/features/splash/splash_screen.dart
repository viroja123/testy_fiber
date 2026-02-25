import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:testy_fiber/core/constants/app_colors.dart';
import '../../core/routes/app_routes.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();

    Future.delayed(const Duration(seconds: 3), () {
      if (!mounted) return;
      Navigator.pushReplacementNamed(context, AppRoutes.home);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primary,
      body: Stack(
        children: [
          // 🔵 Background
          Container(color: AppColors.primary),

          // 🖼 Bottom Illustration (Start from Left)
          Positioned(
            bottom: 0,
            left: 0,
            child: Image.asset(
              "assets/images/splashUser.png",
              width: MediaQuery.of(context).size.width,
              fit: BoxFit.cover,
            ),
          ),

          // 🔷 Logo + Text Centered
          Column(
            children: [
              const SizedBox(height: 100),

              Image.asset("assets/images/logo.png", height: 160, width: 160),

              const SizedBox(height: 10),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    "TASKY",
                    style: GoogleFonts.poppins(
                      fontSize: 36,
                      fontWeight: FontWeight.w800,
                      color: AppColors.secondary,
                    ),
                  ),
                  Text(
                    "FIBER",
                    style: GoogleFonts.poppins(
                      fontSize: 36,
                      fontWeight: FontWeight.w400,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
