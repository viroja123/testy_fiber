class CrochetPattern {
  final String id;
  final String name;
  final String category;
  final String difficulty;
  final String description;

  const CrochetPattern({
    required this.id,
    required this.name,
    required this.category,
    required this.difficulty,
    this.description = '',
  });
}
