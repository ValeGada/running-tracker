# Running Tracker App 🏃‍♂️

A complete mobile running tracker built with Expo, React Native, and TypeScript. Track your runs with GPS, view detailed statistics, and reach your fitness goals!

## Features

✨ **Complete Feature Set**:
- 🔐 Authentication flow (Onboarding, Login, Register)
- 📍 Real-time GPS tracking with route visualization
- 🗺️ Interactive maps with route display
- 📊 Detailed run statistics and history
- 💪 Personal records and progress tracking
- ⚙️ Customizable user settings
- 🎨 Beautiful UI with UI Kitten components

## Tech Stack

- **Framework**: Expo + React Native
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation (Native Stack + Bottom Tabs)
- **UI Library**: UI Kitten + Eva Design System
- **Forms**: React Hook Form + Zod validation
- **Maps**: React Native Maps
- **Location**: Expo Location + Task Manager
- **Styling**: Custom theme with pink primary color (#DC3760)

## Project Structure

```
src/
├── screens/        # All screen components
│   ├── OnboardingScreen.tsx
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── HomeScreen.tsx
│   ├── RunSessionScreen.tsx
│   ├── SummaryScreen.tsx
│   └── SettingsScreen.tsx
├── components/     # Reusable UI components
│   ├── Button.tsx
│   └── RunCard.tsx
├── navigation/     # Navigation configuration
│   ├── AuthNavigator.tsx
│   ├── MainNavigator.tsx
│   └── RootNavigator.tsx
├── hooks/          # Custom React hooks
│   ├── useAuth.ts
│   └── useLocationTracking.ts
├── store/          # Redux state management
│   ├── store.ts
│   ├── authSlice.ts
│   └── runSlice.ts
├── services/       # API and external services
│   ├── api.ts
│   └── locationService.ts
├── theme/          # Custom theme configuration
│   └── theme.ts
└── types/          # TypeScript interfaces and types
    └── index.ts
```

## Getting Started on Replit

### 1. Run the project
The project is already configured for Replit. Simply click the **Run** button or use:
```bash
npm run start
```

### 2. Test on your phone
1. Install **Expo Go** on your phone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code that appears in the console with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

3. The app will load on your phone automatically!

## Getting Started Locally

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd running-tracker
```

2. Install dependencies
```bash
npm install
```

3. Start the Expo development server
```bash
npm run start
```

4. Run on your device/simulator
```bash
# iOS (requires macOS)
npm run ios

# Android
npm run android

# Web browser
npm run web
```

## Authentication

The app includes a complete authentication flow with mock authentication (no backend required for demo):

- **Onboarding**: Welcome screen with app features
- **Login**: Email/password login with validation
- **Register**: New account creation with password confirmation

Default behavior: `isLoggedIn` starts as `false`. Use any email/password to "login" (mock).

## Features Overview

### Home Screen
- View your running history
- See quick stats for each run
- Mock data included for demonstration

### Run Session Screen
- Start/pause/stop run tracking
- Real-time distance, time, and pace
- Interactive map with route visualization
- Location permission handling

### Summary Screen
- Total runs, distance, duration, and calories
- Average statistics
- Performance insights

### Settings Screen
- User profile management
- App preferences
- Logout functionality

## Configuration

### Expo Tunnel Mode
The app uses Expo tunnel mode (`--tunnel`) for easy access from external networks on Replit.

### Environment Variables
Create a `.env` file for API configuration (optional):
```
EXPO_PUBLIC_API_URL=https://your-api-url.com
```

## Customization

### Theme Colors
Edit `src/theme/theme.ts` to customize colors:
- Primary: `#DC3760` (pink)
- Background: `#FFFFFF` (white)
- Text: `#2E3A59` (dark gray)

### Typography
The app uses DM Sans font (configured in theme).

## Development Notes

### Mock Data
The app includes mock data for:
- User authentication
- Run history
- Location tracking structure

### Location Services
Location tracking requires:
- User permission (requested automatically)
- Physical device (simulators have limited GPS)

### State Management
- Redux Toolkit for global state
- Slices: `authSlice`, `runSlice`
- Persistent storage: Not implemented (add Redux Persist if needed)

## Known Limitations

- Mock authentication (no real backend)
- Run data not persisted (add backend API)
- Location tracking structure ready but simplified
- Maps require Google Maps API key for production

## Next Steps

To make this production-ready:

1. **Backend Integration**
   - Add real authentication API
   - Store run data in database
   - Implement user profiles

2. **Enhanced Features**
   - Social sharing
   - Running challenges
   - Audio coaching
   - Health app integration

3. **Performance**
   - Add Redux Persist for offline support
   - Implement background location tracking
   - Optimize map rendering

## Troubleshooting

### App won't load on phone
- Make sure you're on the same network
- Try using tunnel mode: `expo start --tunnel`
- Check firewall settings

### Location not working
- Grant location permissions in phone settings
- Test on a physical device (not simulator)
- Check Location Services are enabled

### Build errors
- Clear cache: `rm -rf node_modules && npm install`
- Reset Expo: `expo start --clear`

## License

MIT License - feel free to use this project for learning and development!

## Support

For issues and questions:
- Check Expo documentation: https://docs.expo.dev
- React Navigation: https://reactnavigation.org
- UI Kitten: https://akveo.github.io/react-native-ui-kitten

Happy running! 🏃‍♂️💨
