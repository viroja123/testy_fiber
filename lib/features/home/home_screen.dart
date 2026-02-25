import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:testy_fiber/core/constants/app_colors.dart';
import 'package:testy_fiber/features/Project/ProjectScreen.dart';
import 'package:testy_fiber/features/learning/learningScreen.dart';
import 'package:testy_fiber/features/menu/menuScreen.dart';
import 'package:testy_fiber/models/project_model.dart';
import 'package:testy_fiber/services/project_service.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;
  Project? _selectedProject;
  final ProjectService _service = ProjectService();

  // Daily hints data
  final List<Map<String, String>> _dailyHints = const [
    {
      'quote': '" I have enough yarn, said\n  no one ever. "',
      'idea': 'Your Creative Idea',
      'days': '10 Days',
    },
    {
      'quote': '" Crochet is my therapy,\n  yarn is my medicine. "',
      'idea': 'Relaxation Vibes',
      'days': '5 Days',
    },
    {
      'quote': '" Life is too short for\n  boring yarn colors. "',
      'idea': 'Color Inspiration',
      'days': '3 Days',
    },
  ];

  void _onProjectSelected(Project project) {
    setState(() {
      _selectedProject = project;
      _selectedIndex = 2; // Switch to Learn / Details tab
    });
  }

  void _refresh() {
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    // Choose the screen based on active tab
    Widget currentScreen;
    switch (_selectedIndex) {
      case 0:
        currentScreen = _buildHomeScreenContent();
        break;
      case 1:
        currentScreen = ProjectScreen(
          onProjectSelected: _onProjectSelected,
          onRefresh: _refresh,
        );
        break;
      case 2:
        currentScreen = LearningScreen(
          project: _selectedProject,
          onProjectUpdated: _refresh,
          onProjectDeleted: () {
            setState(() {
              _selectedProject = null;
              _selectedIndex = 1; // Back to Projects
            });
          },
        );
        break;
      case 3:
        currentScreen = const MenuScreen();
        break;
      default:
        currentScreen = _buildHomeScreenContent();
    }

    return Scaffold(
      backgroundColor: AppColors.primary,
      body: SafeArea(child: currentScreen),
      bottomNavigationBar: SafeArea(
        top: false,
        child: Container(
          height: 80,
          decoration: BoxDecoration(
            color: const Color(0xFF3C3C3C),
            borderRadius: BorderRadius.circular(40),
            boxShadow: [
              BoxShadow(
                color: AppColors.lightGrey.withOpacity(0.4),
                blurRadius: 10,
                offset: const Offset(0, 1),
              ),
            ],
          ),
          padding: const EdgeInsets.symmetric(horizontal: 10),
          margin: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildBottomNavItem(index: 0, icon: Icons.home, label: "Home"),
              _buildBottomNavItem(index: 1, icon: Icons.work, label: "Project"),
              _buildBottomNavItem(index: 2, icon: Icons.book, label: "Learn"),
              _buildBottomNavItem(index: 3, icon: Icons.menu, label: "Menu"),
            ],
          ),
        ),
      ),
    );
  }

  // ─────────────────────────────────────────────────
  // Home Screen Content (Dynamic)
  // ─────────────────────────────────────────────────
  Widget _buildHomeScreenContent() {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // ── Welcome Back Header ──
            Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Text(
                  "Welcome ",
                  style: GoogleFonts.poppins(
                    fontSize: 28,
                    fontWeight: FontWeight.w700,
                    color: AppColors.secondary,
                  ),
                ),
                Text(
                  "Back!",
                  style: GoogleFonts.poppins(
                    fontSize: 28,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),

            // ── Jump Back In ──
            Text(
              "Jump Back In",
              style: GoogleFonts.poppins(
                fontSize: 21,
                fontWeight: FontWeight.w600,
                color: AppColors.white,
              ),
            ),
            const SizedBox(height: 8),
            _buildJumpBackInCard(),
            const SizedBox(height: 24),

            // ── Quick Stats ──
            _buildQuickStatsCard(),
            const SizedBox(height: 14),

            // ── Quick Actions ──
            Text(
              "Quick Actions",
              style: GoogleFonts.poppins(
                fontSize: 21,
                fontWeight: FontWeight.w600,
                color: AppColors.white,
              ),
            ),
            const SizedBox(height: 12),
            _buildQuickActions(),
            const SizedBox(height: 12),

            // ── Daily Hints ──
            Text(
              "Daily Hints",
              style: GoogleFonts.poppins(
                fontSize: 21,
                fontWeight: FontWeight.w600,
                color: AppColors.white,
              ),
            ),
            const SizedBox(height: 14),
            _buildDailyHintsCard(),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  // ─────────────────────────────────────────────────
  // Jump Back In Card (Dynamic)
  // ─────────────────────────────────────────────────
  Widget _buildJumpBackInCard() {
    final lastProject = _service.lastActiveProject;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 28),
      decoration: BoxDecoration(
        color: AppColors.blue,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF6741FF),
            blurRadius: 20,
            offset: const Offset(5, 6),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  lastProject?.name ?? "New Task",
                  style: GoogleFonts.poppins(
                    fontSize: 21,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 2),
                Text(
                  lastProject != null
                      ? "Row ${lastProject.currentRow}"
                      : "No active projects",
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AppColors.secondary,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          ElevatedButton(
            onPressed: () {
              if (lastProject != null) {
                _onProjectSelected(lastProject);
              } else {
                // Navigate to projects tab
                setState(() {
                  _selectedIndex = 1;
                });
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.secondary,
              foregroundColor: AppColors.primary,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 10),
              elevation: 4,
            ),
            child: Text(
              lastProject != null ? "Resume" : "Create",
              style: GoogleFonts.poppins(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: AppColors.primary,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ─────────────────────────────────────────────────
  // Quick Stats Card (Dynamic)
  // ─────────────────────────────────────────────────
  Widget _buildQuickStatsCard() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: Colors.white12, width: 1),
        boxShadow: [
          BoxShadow(
            color: AppColors.lightGrey,
            blurRadius: 12,
            offset: const Offset(4, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Text(
            "Quick Stats",
            style: GoogleFonts.poppins(
              fontSize: 21,
              fontWeight: FontWeight.w600,
              color: AppColors.primary,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              // In Progress
              Column(
                children: [
                  Text(
                    "${_service.inProgressCount}",
                    style: GoogleFonts.poppins(
                      fontSize: 47,
                      fontWeight: FontWeight.w600,
                      color: AppColors.blue,
                    ),
                  ),
                  Text(
                    "In Progress",
                    style: GoogleFonts.poppins(
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                      color: AppColors.lightGrey,
                    ),
                  ),
                ],
              ),
              // Divider
              Container(width: 1, height: 60, color: Colors.black12),
              // Completed
              Column(
                children: [
                  Text(
                    "${_service.completedCount}",
                    style: GoogleFonts.poppins(
                      fontSize: 47,
                      fontWeight: FontWeight.w600,
                      color: AppColors.lightRed,
                    ),
                  ),
                  Text(
                    "Completed",
                    style: GoogleFonts.poppins(
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                      color: AppColors.lightGrey,
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

  // ─────────────────────────────────────────────────
  // Quick Actions
  // ─────────────────────────────────────────────────
  Widget _buildQuickActions() {
    return Row(
      children: [
        // New Project → navigate to projects tab
        Expanded(
          child: GestureDetector(
            onTap: () {
              setState(() {
                _selectedIndex = 1; // Go to project tab
              });
            },
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 13),
              decoration: BoxDecoration(
                color: AppColors.secondary,
                borderRadius: BorderRadius.circular(42),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.secondary.withOpacity(0.3),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                children: [
                  const Icon(Icons.add, size: 32, color: AppColors.primary),
                  const SizedBox(height: 2),
                  Text(
                    "New Project",
                    style: GoogleFonts.poppins(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppColors.primary,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(width: 16),
        // Yarn Stash → navigate to patterns/menu tab
        Expanded(
          child: GestureDetector(
            onTap: () {
              setState(() {
                _selectedIndex = 3; // Go to menu / patterns tab
              });
            },
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 13),
              decoration: BoxDecoration(
                color: AppColors.white,
                borderRadius: BorderRadius.circular(42),
                border: Border.all(color: Colors.white24, width: 1.5),
              ),
              child: Column(
                children: [
                  const Icon(Icons.menu, size: 32, color: AppColors.primary),
                  const SizedBox(height: 2),
                  Text(
                    "Yarn Stash",
                    style: GoogleFonts.poppins(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppColors.primary,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  // ─────────────────────────────────────────────────
  // Daily Hints Card
  // ─────────────────────────────────────────────────
  Widget _buildDailyHintsCard() {
    // Rotate hints based on day of year
    final dayIndex = DateTime.now().day % _dailyHints.length;
    final hint = _dailyHints[dayIndex];

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFFF7741), Color(0xFF3E2799)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(22),
        boxShadow: [
          BoxShadow(
            color: AppColors.blue,
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                hint['idea']!,
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppColors.white,
                ),
              ),
              Row(
                children: [
                  const Text("🔥", style: TextStyle(fontSize: 16)),
                  const SizedBox(width: 4),
                  Text(
                    hint['days']!,
                    style: GoogleFonts.poppins(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppColors.white,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 7),

          Container(height: 2, color: AppColors.white),
          const SizedBox(height: 7),
          Text(
            hint['quote']!,
            textAlign: TextAlign.center,
            style: GoogleFonts.poppins(
              fontSize: 20,
              fontWeight: FontWeight.w400,
              color: Colors.white,
              textStyle: const TextStyle(fontStyle: FontStyle.italic),
            ),
          ),
        ],
      ),
    );
  }

  // ─────────────────────────────────────────────────
  // Bottom Nav Item
  // ─────────────────────────────────────────────────
  Widget _buildBottomNavItem({
    required int index,
    required IconData icon,
    required String label,
  }) {
    bool isSelected = _selectedIndex == index;

    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            _selectedIndex = index;
          });
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.primary : Colors.transparent,
            borderRadius: BorderRadius.circular(30),
            boxShadow: [
              BoxShadow(
                color: isSelected ? AppColors.darkGrey : Colors.transparent,
                blurRadius: 10,
                offset: const Offset(2, 4),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                icon,
                color: isSelected ? Colors.white : AppColors.lightGrey,
                size: 22,
              ),
              const SizedBox(height: 2),
              Text(
                label,
                style: GoogleFonts.poppins(
                  color: isSelected ? Colors.white : AppColors.lightGrey,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
