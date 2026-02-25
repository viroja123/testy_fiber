import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'features/splash/splash_screen.dart';
import 'features/home/home_screen.dart';
import 'core/routes/app_routes.dart';
import 'services/project_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize local storage before app starts
  await ProjectService().init();

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(textTheme: GoogleFonts.poppinsTextTheme()),
      initialRoute: AppRoutes.splash,
      routes: {
        AppRoutes.splash: (context) => const SplashScreen(),
        AppRoutes.home: (context) => const HomeScreen(),
      },
    );
  }
}
