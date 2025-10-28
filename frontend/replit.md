# Running Tracker App - Replit Project

## Overview
Complete Expo + React Native + TypeScript mobile running tracker app optimized for Replit's free plan.

## Purpose
Demonstration app for GPS-based run tracking with complete authentication, navigation, and state management implementation.

## Current State
✅ Fully functional with mock data
✅ All screens implemented (Onboarding, Login, Register, Home, Run Session, Summary, Settings)
✅ Redux state management configured
✅ React Navigation with Auth and Main stacks
✅ UI Kitten theme with custom pink color (#DC3760)
✅ Location services structure ready
✅ Forms with validation (react-hook-form + zod)

## Recent Changes
- 2025-10-28: Initial project setup with complete modular structure
- Complete folder organization (screens, components, navigation, hooks, store, services, theme, types)
- Mock authentication flow implemented
- GPS location tracking structure created
- React Native Maps integration prepared

## User Preferences
- Language: TypeScript
- State Management: Redux Toolkit
- Navigation: React Navigation (native-stack + bottom-tabs)
- UI Framework: UI Kitten + Eva Design System
- Forms: React Hook Form with Zod validation

## Project Architecture

### Structure
```
src/
├── screens/      → All UI screens (Auth + Main)
├── components/   → Reusable UI components
├── navigation/   → Navigation configuration
├── hooks/        → Custom React hooks (useAuth, useLocationTracking)
├── store/        → Redux store + slices
├── services/     → API and external services
├── theme/        → Custom UI Kitten theme
└── types/        → TypeScript interfaces
```

### Key Technologies
- **Frontend**: Expo 54, React Native, TypeScript
- **State**: Redux Toolkit
- **Navigation**: React Navigation v7 (native-stack + bottom-tabs)
- **UI**: UI Kitten + Eva Design System
- **Forms**: React Hook Form + Zod
- **Maps**: React Native Maps
- **Location**: Expo Location + Task Manager

### Authentication Flow
- Mock authentication (no backend required)
- Flow: Onboarding → Login/Register → Main App
- State managed via Redux authSlice
- useAuth hook provides login/logout/register functions

### Main Features
1. **Home Screen**: Run history with stats
2. **Run Session**: GPS tracking with map visualization
3. **Summary**: Aggregate statistics and insights
4. **Settings**: User preferences and logout

## Configuration

### Expo Settings
- Tunnel mode enabled for Replit external access
- Scripts optimized for free plan (no heavy background processes)

### Environment
- Node.js 18.x
- Watchman for file watching
- Expo tunnel mode for external connectivity

## Known Issues & Limitations
- Mock authentication only (backend integration needed for production)
- Run data not persisted (localStorage/backend needed)
- Location tracking structure ready but simplified
- Maps need Google Maps API key for full production features

## Next Development Steps
1. Add backend API for real authentication
2. Implement run data persistence
3. Add background location tracking
4. Integrate health/fitness APIs
5. Add social features (sharing, leaderboards)

## Testing Notes
- Use Expo Go app on physical device
- Grant location permissions when prompted
- Mock login works with any email/password
- Sample run data loads automatically

## Dependencies
All major dependencies installed:
- @reduxjs/toolkit, react-redux (state management)
- @react-navigation/* (navigation)
- @ui-kitten/components, @eva-design/eva (UI)
- expo-location, expo-task-manager (GPS)
- react-native-maps (maps)
- react-hook-form, zod (forms)
- axios, dayjs (utilities)
