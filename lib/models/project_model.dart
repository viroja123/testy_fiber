class Project {
  final String id;
  String name;
  String category;
  int currentRow;
  String hookSize;
  String yarnType;
  String patternNotes;
  bool isCompleted;
  final DateTime createdAt;

  Project({
    required this.id,
    required this.name,
    required this.category,
    this.currentRow = 0,
    this.hookSize = '',
    this.yarnType = '',
    this.patternNotes = '',
    this.isCompleted = false,
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  // ── JSON Serialization ──
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'category': category,
      'currentRow': currentRow,
      'hookSize': hookSize,
      'yarnType': yarnType,
      'patternNotes': patternNotes,
      'isCompleted': isCompleted,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory Project.fromJson(Map<String, dynamic> json) {
    return Project(
      id: json['id'] as String,
      name: json['name'] as String,
      category: json['category'] as String,
      currentRow: json['currentRow'] as int? ?? 0,
      hookSize: json['hookSize'] as String? ?? '',
      yarnType: json['yarnType'] as String? ?? '',
      patternNotes: json['patternNotes'] as String? ?? '',
      isCompleted: json['isCompleted'] as bool? ?? false,
      createdAt: DateTime.tryParse(json['createdAt'] as String? ?? '') ??
          DateTime.now(),
    );
  }
}
