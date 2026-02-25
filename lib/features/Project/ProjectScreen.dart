import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:testy_fiber/core/constants/app_colors.dart';
import 'package:testy_fiber/models/project_model.dart';
import 'package:testy_fiber/services/project_service.dart';

class ProjectScreen extends StatefulWidget {
  final Function(Project) onProjectSelected;
  final VoidCallback onRefresh;

  const ProjectScreen({
    super.key,
    required this.onProjectSelected,
    required this.onRefresh,
  });

  @override
  State<ProjectScreen> createState() => _ProjectScreenState();
}

class _ProjectScreenState extends State<ProjectScreen> {
  final ProjectService _service = ProjectService();

  @override
  Widget build(BuildContext context) {
    final projects = _service.projects;

    return Stack(
      children: [
        SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // ── Header ──
                Row(
                  children: [
                    Text(
                      "Your ",
                      style: GoogleFonts.poppins(
                        fontSize: 28,
                        fontWeight: FontWeight.w700,
                        color: AppColors.white,
                      ),
                    ),
                    Text(
                      "Projects",
                      style: GoogleFonts.poppins(
                        fontSize: 28,
                        fontWeight: FontWeight.w700,
                        color: AppColors.secondary,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // ── Project Cards ──
                if (projects.isEmpty)
                  _buildEmptyState()
                else
                  ...projects.map((project) => _buildProjectCard(project)),

                const SizedBox(height: 90), // Space for FAB
              ],
            ),
          ),
        ),

        // ── Floating Action Button ──
        Positioned(
          bottom: 20,
          left: 0,
          right: 0,
          child: Center(
            child: GestureDetector(
              onTap: () => _showAddProjectSheet(context),
              child: Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: AppColors.secondary,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.secondary.withOpacity(0.4),
                      blurRadius: 16,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: const Icon(
                  Icons.add,
                  size: 36,
                  color: AppColors.primary,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  // ─────────────────────────────────────────────────
  // Empty State
  // ─────────────────────────────────────────────────
  Widget _buildEmptyState() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(40),
      decoration: BoxDecoration(
        color: AppColors.darkGrey,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white10, width: 1),
      ),
      child: Column(
        children: [
          const Icon(
            Icons.folder_open_rounded,
            size: 64,
            color: AppColors.lightGrey,
          ),
          const SizedBox(height: 16),
          Text(
            "No projects yet",
            style: GoogleFonts.poppins(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: AppColors.white,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            "Tap + to create your first project!",
            style: GoogleFonts.poppins(
              fontSize: 14,
              color: AppColors.lightGrey,
            ),
          ),
        ],
      ),
    );
  }

  // ─────────────────────────────────────────────────
  // Project Card
  // ─────────────────────────────────────────────────
  Widget _buildProjectCard(Project project) {
    return GestureDetector(
      onTap: () => widget.onProjectSelected(project),
      child: Container(
        margin: const EdgeInsets.only(bottom: 14),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 16),
        decoration: BoxDecoration(
          color: AppColors.darkGrey,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: Colors.white10, width: 1),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.15),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Row(
          children: [
            // Category Tag
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              decoration: BoxDecoration(
                color: _getCategoryColor(project.category),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                project.category,
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
            ),
            const SizedBox(width: 12),

            // Project Name
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    project.name,
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  if (project.isCompleted)
                    Text(
                      "✓ Completed",
                      style: GoogleFonts.poppins(
                        fontSize: 11,
                        fontWeight: FontWeight.w500,
                        color: AppColors.secondary,
                      ),
                    ),
                ],
              ),
            ),

            // Hamburger Icon
            const Icon(Icons.menu, color: AppColors.lightGrey, size: 22),
            const SizedBox(width: 10),

            // Row Count Badge
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              decoration: BoxDecoration(
                color: AppColors.secondary,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                "Row: ${project.currentRow}",
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: AppColors.primary,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ─────────────────────────────────────────────────
  // Add Project Bottom Sheet
  // ─────────────────────────────────────────────────
  void _showAddProjectSheet(BuildContext context) {
    final nameController = TextEditingController();
    final hookController = TextEditingController();
    final yarnController = TextEditingController();
    final notesController = TextEditingController();
    String selectedCategory = ProjectService.categories.first;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Container(
              padding: EdgeInsets.only(
                top: 20,
                left: 24,
                right: 24,
                bottom: MediaQuery.of(context).viewInsets.bottom + 24,
              ),
              decoration: const BoxDecoration(
                color: Color(0xFF1E1E1E),
                borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Handle Bar
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
                    const SizedBox(height: 20),

                    // Title
                    Text(
                      "New Project",
                      style: GoogleFonts.poppins(
                        fontSize: 24,
                        fontWeight: FontWeight.w700,
                        color: AppColors.secondary,
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Project Name
                    _buildTextField(nameController, "Project Name", Icons.edit),
                    const SizedBox(height: 14),

                    // Category Dropdown
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.darkGrey,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: Colors.white10),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          value: selectedCategory,
                          isExpanded: true,
                          dropdownColor: AppColors.darkGrey,
                          style: GoogleFonts.poppins(
                            fontSize: 14,
                            color: AppColors.white,
                          ),
                          icon: const Icon(
                            Icons.arrow_drop_down,
                            color: AppColors.secondary,
                          ),
                          items: ProjectService.categories.map((cat) {
                            return DropdownMenuItem(
                              value: cat,
                              child: Text(cat),
                            );
                          }).toList(),
                          onChanged: (val) {
                            setModalState(() => selectedCategory = val!);
                          },
                        ),
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Hook Size
                    _buildTextField(
                      hookController,
                      "Hook Size (e.g. 3.5mm)",
                      Icons.straighten,
                    ),
                    const SizedBox(height: 14),

                    // Yarn Type
                    _buildTextField(
                      yarnController,
                      "Yarn Type",
                      Icons.color_lens,
                    ),
                    const SizedBox(height: 14),

                    // Pattern Notes
                    _buildTextField(
                      notesController,
                      "Pattern Notes",
                      Icons.note,
                      maxLines: 3,
                    ),
                    const SizedBox(height: 24),

                    // Create Button
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        onPressed: () async {
                          if (nameController.text.trim().isEmpty) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(
                                  "Please enter a project name",
                                  style: GoogleFonts.poppins(),
                                ),
                                backgroundColor: AppColors.lightRed,
                              ),
                            );
                            return;
                          }

                          final newProject = Project(
                            id: _service.generateId(),
                            name: nameController.text.trim(),
                            category: selectedCategory,
                            hookSize: hookController.text.trim(),
                            yarnType: yarnController.text.trim(),
                            patternNotes: notesController.text.trim(),
                          );

                          await _service.addProject(newProject);
                          Navigator.pop(context);
                          setState(() {});
                          widget.onRefresh();

                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(
                                "\"${newProject.name}\" created! 🧶",
                                style: GoogleFonts.poppins(),
                              ),
                              backgroundColor: AppColors.blue,
                              behavior: SnackBarBehavior.floating,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.secondary,
                          foregroundColor: AppColors.primary,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          elevation: 4,
                        ),
                        child: Text(
                          "Create Project",
                          style: GoogleFonts.poppins(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: AppColors.primary,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildTextField(
    TextEditingController controller,
    String hint,
    IconData icon, {
    int maxLines = 1,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.darkGrey,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.white10),
      ),
      child: TextField(
        controller: controller,
        maxLines: maxLines,
        style: GoogleFonts.poppins(color: AppColors.white, fontSize: 14),
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: GoogleFonts.poppins(
            color: AppColors.lightGrey,
            fontSize: 14,
          ),
          prefixIcon: Icon(icon, color: AppColors.secondary, size: 20),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 14,
          ),
        ),
      ),
    );
  }

  // ─────────────────────────────────────────────────
  // Category Color Helper
  // ─────────────────────────────────────────────────
  Color _getCategoryColor(String category) {
    switch (category.toLowerCase()) {
      case 'decor':
        return AppColors.blue;
      case 'baby':
        return const Color(0xFFE91E8C);
      case 'toys':
        return const Color(0xFFFF8C00);
      case 'accessories':
        return const Color(0xFF00BFA6);
      case 'clothing':
        return const Color(0xFF5C6BC0);
      case 'bags':
        return const Color(0xFF8D6E63);
      case 'home decor':
        return const Color(0xFF7B1FA2);
      case 'blankets':
        return const Color(0xFF0288D1);
      default:
        return AppColors.blue;
    }
  }
}
