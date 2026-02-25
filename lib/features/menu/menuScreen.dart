import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:testy_fiber/core/constants/app_colors.dart';
import 'package:testy_fiber/models/pattern_model.dart';
import 'package:testy_fiber/services/project_service.dart';

class MenuScreen extends StatelessWidget {
  const MenuScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final patterns = ProjectService.patterns;

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
                  "Explore ",
                  style: GoogleFonts.poppins(
                    fontSize: 28,
                    fontWeight: FontWeight.w700,
                    color: AppColors.secondary,
                  ),
                ),
                Text(
                  "Patterns",
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
              "Explore our collection of crochet patterns!",
              style: GoogleFonts.poppins(
                fontSize: 14,
                fontWeight: FontWeight.w400,
                color: AppColors.lightGrey,
              ),
            ),
            const SizedBox(height: 20),

            // ── Pattern Cards ──
            ...patterns.map((pattern) => _buildPatternCard(pattern, context)),

            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  // ─────────────────────────────────────────────────
  // Pattern Card
  // ─────────────────────────────────────────────────
  Widget _buildPatternCard(CrochetPattern pattern, BuildContext context) {
    return GestureDetector(
      onTap: () => _showPatternDetails(pattern, context),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        decoration: BoxDecoration(
          color: AppColors.darkGrey,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: Colors.white10, width: 1),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.12),
              blurRadius: 6,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Row(
          children: [
            // Icon Circle
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: AppColors.blue.withOpacity(0.2),
                shape: BoxShape.circle,
              ),
              child: Center(
                child: Icon(
                  _getPatternIcon(pattern.category),
                  color: AppColors.blue,
                  size: 24,
                ),
              ),
            ),
            const SizedBox(width: 14),

            // Name + Category
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    pattern.name,
                    style: GoogleFonts.poppins(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppColors.white,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    pattern.category,
                    style: GoogleFonts.poppins(
                      fontSize: 13,
                      fontWeight: FontWeight.w400,
                      color: AppColors.lightGrey,
                    ),
                  ),
                ],
              ),
            ),

            // Difficulty Badge
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              decoration: BoxDecoration(
                color: _getDifficultyColor(
                  pattern.difficulty,
                ).withOpacity(0.15),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: _getDifficultyColor(pattern.difficulty),
                  width: 1.5,
                ),
              ),
              child: Text(
                pattern.difficulty,
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: _getDifficultyColor(pattern.difficulty),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ─────────────────────────────────────────────────
  // Pattern Details Bottom Sheet
  // ─────────────────────────────────────────────────
  void _showPatternDetails(CrochetPattern pattern, BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          padding: const EdgeInsets.all(24),
          decoration: const BoxDecoration(
            color: Color(0xFF1E1E1E),
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Handle
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppColors.lightGrey,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // Pattern Name
              Text(
                pattern.name,
                style: GoogleFonts.poppins(
                  fontSize: 24,
                  fontWeight: FontWeight.w700,
                  color: AppColors.white,
                ),
              ),
              const SizedBox(height: 8),

              // Category + Difficulty Row
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.blue,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      pattern.category,
                      style: GoogleFonts.poppins(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: _getDifficultyColor(
                        pattern.difficulty,
                      ).withOpacity(0.15),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: _getDifficultyColor(pattern.difficulty),
                        width: 1.5,
                      ),
                    ),
                    child: Text(
                      pattern.difficulty,
                      style: GoogleFonts.poppins(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: _getDifficultyColor(pattern.difficulty),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 18),

              // Description
              Text(
                pattern.description,
                style: GoogleFonts.poppins(
                  fontSize: 15,
                  color: AppColors.lightGrey,
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 24),

              // Start Pattern Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(ctx),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.secondary,
                    foregroundColor: AppColors.primary,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    elevation: 4,
                  ),
                  child: Text(
                    "Start This Pattern",
                    style: GoogleFonts.poppins(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: AppColors.primary,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 10),
            ],
          ),
        );
      },
    );
  }

  // ─────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────
  IconData _getPatternIcon(String category) {
    switch (category.toLowerCase()) {
      case 'amigurumi':
        return Icons.pets;
      case 'blankets':
        return Icons.grid_on_rounded;
      case 'accessories':
        return Icons.checkroom;
      case 'baby':
        return Icons.child_care;
      case 'home decor':
        return Icons.home_rounded;
      case 'bags':
        return Icons.shopping_bag;
      default:
        return Icons.auto_awesome;
    }
  }

  Color _getDifficultyColor(String difficulty) {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return AppColors.secondary;
      case 'intermediate':
        return const Color(0xFFFFB74D);
      case 'advanced':
        return AppColors.lightRed;
      default:
        return AppColors.secondary;
    }
  }
}
