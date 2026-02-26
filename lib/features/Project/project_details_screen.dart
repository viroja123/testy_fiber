import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:testy_fiber/core/constants/app_colors.dart';
import 'package:testy_fiber/models/project_model.dart';
import 'package:testy_fiber/services/project_service.dart';

class ProjectDetailsScreen extends StatefulWidget {
  final Project project;
  final VoidCallback onProjectUpdated;
  final VoidCallback onProjectDeleted;

  const ProjectDetailsScreen({
    super.key,
    required this.project,
    required this.onProjectUpdated,
    required this.onProjectDeleted,
  });

  @override
  State<ProjectDetailsScreen> createState() => _ProjectDetailsScreenState();
}

class _ProjectDetailsScreenState extends State<ProjectDetailsScreen>
    with SingleTickerProviderStateMixin {
  final ProjectService _service = ProjectService();
  late AnimationController _pulseController;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 200),
      lowerBound: 0.9,
      upperBound: 1.0,
      value: 1.0,
    );
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primary,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // ── Header ──
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Text(
                    "Project ",
                    style: GoogleFonts.poppins(
                      fontSize: 28,
                      fontWeight: FontWeight.w700,
                      color: AppColors.secondary,
                    ),
                  ),
                  Text(
                    "Details",
                    style: GoogleFonts.poppins(
                      fontSize: 28,
                      fontWeight: FontWeight.w700,
                      color: AppColors.white,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // ── Content ──
              _buildProjectDetails(widget.project),
            ],
          ),
        ),
      ),
    );
  }

  // ─────────────────────────────────────────────────
  // Project Details
  // ─────────────────────────────────────────────────
  Widget _buildProjectDetails(Project project) {
    return Column(
      children: [
        // ── Project Name ──
        Text(
          project.name,
          textAlign: TextAlign.center,
          style: GoogleFonts.poppins(
            fontSize: 22,
            fontWeight: FontWeight.w700,
            color: AppColors.white,
          ),
        ),
        const SizedBox(height: 12),

        // ── Category Badge ──
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
          decoration: BoxDecoration(
            color: AppColors.secondary,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            project.category,
            style: GoogleFonts.poppins(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: AppColors.primary,
            ),
          ),
        ),
        const SizedBox(height: 28),

        // ── Materials Info ──
        if (project.hookSize.isNotEmpty || project.yarnType.isNotEmpty)
          Column(
            children: [
              if (project.hookSize.isNotEmpty)
                Text(
                  "Hook: ${project.hookSize}",
                  style: GoogleFonts.poppins(
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                    color: AppColors.lightGrey,
                  ),
                ),
              if (project.yarnType.isNotEmpty)
                Text(
                  project.yarnType,
                  style: GoogleFonts.poppins(
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                    color: AppColors.lightGrey,
                  ),
                ),
              const SizedBox(height: 28),
            ],
          ),

        // ── Row Counter ──
        _buildRowCounter(project),
        const SizedBox(height: 28),

        // ── Pattern Notes ──
        if (project.patternNotes.isNotEmpty) _buildPatternNotes(project),
        const SizedBox(height: 28),

        // ── Mark as Completed ──
        if (!project.isCompleted) _buildMarkCompletedButton(project),
        if (project.isCompleted)
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 16),
            decoration: BoxDecoration(
              color: AppColors.secondary.withOpacity(0.15),
              borderRadius: BorderRadius.circular(30),
              border: Border.all(color: AppColors.secondary, width: 2),
            ),
            child: Center(
              child: Text(
                "✓ Completed",
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.secondary,
                ),
              ),
            ),
          ),
        const SizedBox(height: 16),

        // ── Delete Project ──
        GestureDetector(
          onTap: () => _showDeleteConfirmation(project),
          child: Text(
            "Delete Project",
            style: GoogleFonts.poppins(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: AppColors.lightRed,
              decoration: TextDecoration.underline,
              decorationColor: AppColors.lightRed,
            ),
          ),
        ),
        const SizedBox(height: 30),
      ],
    );
  }

  // ─────────────────────────────────────────────────
  // Row Counter
  // ─────────────────────────────────────────────────
  Widget _buildRowCounter(Project project) {
    return Column(
      children: [
        Text(
          "Current Row",
          style: GoogleFonts.poppins(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: AppColors.white,
          ),
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Minus Button
            GestureDetector(
              onTap: () async {
                if (project.currentRow > 0) {
                  _pulseController.reverse().then(
                    (_) => _pulseController.forward(),
                  );
                  await _service.decrementRow(project.id);
                  setState(() {});
                  widget.onProjectUpdated();
                }
              },
              child: Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: const Color(0xFFFF6B9D),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFFF6B9D).withOpacity(0.4),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: const Center(
                  child: Icon(Icons.remove, size: 32, color: Colors.white),
                ),
              ),
            ),
            const SizedBox(width: 36),

            // Row Count Number
            ScaleTransition(
              scale: _pulseController,
              child: Text(
                "${project.currentRow}",
                style: GoogleFonts.poppins(
                  fontSize: 64,
                  fontWeight: FontWeight.w700,
                  color: AppColors.blue,
                ),
              ),
            ),
            const SizedBox(width: 36),

            // Plus Button
            GestureDetector(
              onTap: () async {
                _pulseController.reverse().then(
                  (_) => _pulseController.forward(),
                );
                await _service.incrementRow(project.id);
                setState(() {});
                widget.onProjectUpdated();
              },
              child: Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: AppColors.secondary,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.secondary.withOpacity(0.4),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: const Center(
                  child: Icon(Icons.add, size: 32, color: AppColors.primary),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  // ─────────────────────────────────────────────────
  // Pattern Notes
  // ─────────────────────────────────────────────────
  Widget _buildPatternNotes(Project project) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.blue.withOpacity(0.15),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.blue.withOpacity(0.3), width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.note_alt_rounded,
                size: 20,
                color: AppColors.blue,
              ),
              const SizedBox(width: 8),
              Text(
                "Pattern Notes",
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            project.patternNotes,
            style: GoogleFonts.poppins(
              fontSize: 14,
              fontWeight: FontWeight.w400,
              color: AppColors.lightGrey,
              height: 1.6,
            ),
          ),
        ],
      ),
    );
  }

  // ─────────────────────────────────────────────────
  // Mark Completed Button
  // ─────────────────────────────────────────────────
  Widget _buildMarkCompletedButton(Project project) {
    return GestureDetector(
      onTap: () async {
        await _service.markAsCompleted(project.id);
        setState(() {});
        widget.onProjectUpdated();

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              "\"${project.name}\" marked as completed! 🎉",
              style: GoogleFonts.poppins(),
            ),
            backgroundColor: AppColors.secondary,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        );
      },
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: AppColors.primary,
          borderRadius: BorderRadius.circular(30),
          border: Border.all(color: AppColors.white, width: 2),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.3),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Center(
          child: Text(
            "Mark as Completed",
            style: GoogleFonts.poppins(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: AppColors.white,
            ),
          ),
        ),
      ),
    );
  }

  // ─────────────────────────────────────────────────
  // Delete Confirmation
  // ─────────────────────────────────────────────────
  void _showDeleteConfirmation(Project project) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E1E1E),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text(
          "Delete Project?",
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.w700,
            color: AppColors.white,
          ),
        ),
        content: Text(
          "Are you sure you want to delete \"${project.name}\"? This cannot be undone.",
          style: GoogleFonts.poppins(fontSize: 14, color: AppColors.lightGrey),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text(
              "Cancel",
              style: GoogleFonts.poppins(
                fontWeight: FontWeight.w600,
                color: AppColors.lightGrey,
              ),
            ),
          ),
          TextButton(
            onPressed: () async {
              await _service.removeProject(project.id);
              Navigator.pop(ctx);
              widget.onProjectDeleted();

              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    "\"${project.name}\" deleted",
                    style: GoogleFonts.poppins(),
                  ),
                  backgroundColor: AppColors.lightRed,
                  behavior: SnackBarBehavior.floating,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              );
            },
            child: Text(
              "Delete",
              style: GoogleFonts.poppins(
                fontWeight: FontWeight.w700,
                color: AppColors.lightRed,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
