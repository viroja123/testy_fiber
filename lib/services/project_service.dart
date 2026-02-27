import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import '../models/project_model.dart';
import '../models/pattern_model.dart';

class ProjectService {
  // ── Singleton ──
  static final ProjectService _instance = ProjectService._internal();
  factory ProjectService() => _instance;
  ProjectService._internal();

  static const String _storageKey = 'testy_fiber_projects';

  List<Project> _projects = [];
  bool _isInitialized = false;

  // ── Initialize (must be called once at app startup) ──
  Future<void> init() async {
    if (_isInitialized) return;

    final prefs = await SharedPreferences.getInstance();
    final jsonString = prefs.getString(_storageKey);

    if (jsonString != null) {
      // Load saved projects
      try {
        final List<dynamic> jsonList = json.decode(jsonString);
        _projects = jsonList
            .map((item) => Project.fromJson(item as Map<String, dynamic>))
            .toList();
      } catch (e) {
        // If data is corrupted, start with seed data
        _projects = _getSeedProjects();
        await _save();
      }
    } else {
      // First launch — use seed data
      _projects = _getSeedProjects();
      await _save();
    }

    _isInitialized = true;
  }

  // ── Save to SharedPreferences ──
  Future<void> _save() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonString = json.encode(_projects.map((p) => p.toJson()).toList());
    await prefs.setString(_storageKey, jsonString);
  }

  // ── Seed Data (only for first launch) ──
  List<Project> _getSeedProjects() {
    return [
      Project(
        id: '1',
        name: 'Floral Coaster Set',
        category: 'Decor',
        currentRow: 2,
        hookSize: '3.5mm',
        yarnType: 'Cotton Yarn, Brown',
        patternNotes:
            'Pattern Link: (Example)\nRemember to use a stitch markergg!',
      ),
      Project(
        id: '2',
        name: 'Baby Blanket',
        category: 'Baby',
        currentRow: 15,
        hookSize: '5.0mm',
        yarnType: 'Acrylic Yarn, Pastel Pink',
        patternNotes:
            'Switch color every 10 rows\nUse a 5mm hook for this pattern.',
      ),
      Project(
        id: '3',
        name: 'Amigurumi Teddy Bear',
        category: 'Toys',
        currentRow: 24,
        hookSize: '3.0mm',
        yarnType: 'Cotton Yarn, Beige',
        patternNotes: 'Stuff firmly with fiberfill\nUse safety eyes 8mm',
        isCompleted: true,
      ),
      Project(
        id: '4',
        name: 'Cozy Winter Scarf',
        category: 'Accessories',
        currentRow: 42,
        hookSize: '6.0mm',
        yarnType: 'Wool Blend, Charcoal',
        patternNotes:
            'Ribbed pattern: ch 2, hdc in 3rd loop\nFinish with fringe tassels',
        isCompleted: true,
      ),
      Project(
        id: '5',
        name: 'Sunflower Granny Square',
        category: 'Decor',
        currentRow: 6,
        hookSize: '4.0mm',
        yarnType: 'Cotton Yarn, Yellow & Green',
        patternNotes:
            'Join squares with slip stitch\nBlock before sewing together',
      ),
    ];
  }

  // ── Getters ──
  List<Project> get projects => List.unmodifiable(_projects);

  List<Project> get activeProjects =>
      _projects.where((p) => !p.isCompleted).toList();

  List<Project> get completedProjects =>
      _projects.where((p) => p.isCompleted).toList();

  int get inProgressCount => activeProjects.length;
  int get completedCount => completedProjects.length;

  Project? get lastActiveProject =>
      activeProjects.isNotEmpty ? activeProjects.first : null;

  // ── CRUD Operations (all auto-save) ──
  Future<void> addProject(Project project) async {
    _projects.insert(0, project);
    await _save();
  }

  Future<void> updateProject(Project project) async {
    final index = _projects.indexWhere((p) => p.id == project.id);
    if (index != -1) {
      _projects[index] = project;
      await _save();
    }
  }

  Future<void> removeProject(String id) async {
    _projects.removeWhere((p) => p.id == id);
    await _save();
  }

  Future<void> incrementRow(String id) async {
    final project = _projects.firstWhere((p) => p.id == id);
    project.currentRow++;
    await _save();
  }

  Future<void> decrementRow(String id) async {
    final project = _projects.firstWhere((p) => p.id == id);
    if (project.currentRow > 0) {
      project.currentRow--;
    }
    await _save();
  }

  Future<void> markAsCompleted(String id) async {
    final project = _projects.firstWhere((p) => p.id == id);
    project.isCompleted = true;
    await _save();
  }

  String generateId() {
    return DateTime.now().millisecondsSinceEpoch.toString();
  }

  // ── Static Pattern Library ──
  static const List<CrochetPattern> patterns = [
    CrochetPattern(
      id: '1',
      name: 'Bumble Bee',
      category: 'Amigurumi',
      difficulty: 'Beginner',
      description: 'Adorable bumble bee stuffed toy',
    ),
    CrochetPattern(
      id: '2',
      name: 'Granny Square Blanket',
      category: 'Blankets',
      difficulty: 'Beginner',
      description: 'Classic granny square blanket pattern',
    ),
    CrochetPattern(
      id: '3',
      name: 'Cable Knit Scarf',
      category: 'Accessories',
      difficulty: 'Intermediate',
      description: 'Warm cable knit scarf for winter',
    ),
    CrochetPattern(
      id: '4',
      name: 'Flower Crown',
      category: 'Accessories',
      difficulty: 'Beginner',
      description: 'Beautiful spring flower crown',
    ),
    CrochetPattern(
      id: '5',
      name: 'Baby Booties',
      category: 'Baby',
      difficulty: 'Beginner',
      description: 'Cute and cozy baby booties',
    ),
    CrochetPattern(
      id: '6',
      name: 'Mandala Rug',
      category: 'Home Decor',
      difficulty: 'Advanced',
      description: 'Large mandala floor rug pattern',
    ),
    CrochetPattern(
      id: '7',
      name: 'Dinosaur Toy',
      category: 'Amigurumi',
      difficulty: 'Intermediate',
      description: 'Fun dinosaur stuffed animal',
    ),
    CrochetPattern(
      id: '8',
      name: 'Market Tote Bag',
      category: 'Bags',
      difficulty: 'Beginner',
      description: 'Reusable crochet market bag',
    ),
  ];

  // ── Category List ──
  static const List<String> categories = [
    'Decor',
    'Baby',
    'Toys',
    'Accessories',
    'Clothing',
    'Bags',
    'Home Decor',
    'Blankets',
  ];
}
