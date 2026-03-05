import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:testy_fiber/core/constants/app_colors.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:share_plus/share_plus.dart';

class MenuScreen extends StatelessWidget {
  const MenuScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Header ──
            Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Text(
                  "App ",
                  style: GoogleFonts.poppins(
                    fontSize: 28,
                    fontWeight: FontWeight.w700,
                    color: AppColors.secondary,
                  ),
                ),
                Text(
                  "Menu",
                  style: GoogleFonts.poppins(
                    fontSize: 28,
                    fontWeight: FontWeight.w700,
                    color: AppColors.white,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),

            // ── Subtitle ──
            Text(
              "Settings and preferences",
              style: GoogleFonts.poppins(
                fontSize: 14,
                fontWeight: FontWeight.w400,
                color: AppColors.lightGrey,
              ),
            ),
            const SizedBox(height: 30),

            _buildMenuItem(
              context,
              icon: Icons.privacy_tip_rounded,
              title: "Privacy Policy",
              onTap: () async {
                final Uri url = Uri.parse(
                  "https://sites.google.com/view/taskyfiberprivacypolicy/home",
                );
                if (!await launchUrl(url)) {
                  _showTempDialog(context, "Could not launch Privacy Policy");
                }
              },
            ),
            const SizedBox(height: 16),

            _buildMenuItem(
              context,
              icon: Icons.share_rounded,
              title: "Share App",
              onTap: () {
                Share.share(
                  'Check out Tasky Fiber, an amazing app for managing your tasks!\n\nDownload Now: https://play.google.com/store/apps/details?id=com.taskyfiber.app',
                );
              },
            ),
            const SizedBox(height: 16),

            _buildMenuItem(
              context,
              icon: Icons.star_rounded,
              title: "Rate It",
              onTap: () async {
                // Placeholder link for Google Play or App Store
                final Uri storeUrl = Uri.parse(
                  "https://play.google.com/store/apps/details?id=com.taskyfiber.app",
                );
                if (!await launchUrl(storeUrl)) {
                  _showTempDialog(context, "Could not open App Store");
                }
              },
            ),
            const SizedBox(height: 16),
            // App Version
            Center(
              child: Text(
                "App Version 1.0.0",
                style: GoogleFonts.poppins(
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                  color: AppColors.lightGrey,
                ),
              ),
            ),

            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  void _showTempDialog(BuildContext context, String title) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          "$title functionality coming soon!",
          style: GoogleFonts.poppins(),
        ),
        backgroundColor: AppColors.secondary,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  Widget _buildMenuItem(
    BuildContext context, {
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
        decoration: BoxDecoration(
          color: AppColors.darkGrey,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.white10, width: 1),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.12),
              blurRadius: 8,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.blue.withOpacity(0.2),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: AppColors.blue, size: 24),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                title,
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppColors.white,
                ),
              ),
            ),
            const Icon(
              Icons.arrow_forward_ios_rounded,
              color: AppColors.lightGrey,
              size: 18,
            ),
          ],
        ),
      ),
    );
  }
}
