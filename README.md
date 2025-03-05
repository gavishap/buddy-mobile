# Waggy Mobile

A React Native mobile application for connecting pet owners with pet sitters. This app allows pet owners to find, book, and manage pet sitting services, while pet sitters can manage their availability, accept bookings, and communicate with pet owners.

## Features

### For Pet Owners

- Create and manage pet profiles
- Find available pet sitters
- Book pet sitting services
- Track booking status
- Communicate with sitters

### For Pet Sitters

- Create and manage sitter profile
- Set availability and services
- Accept or decline booking requests
- Communicate with pet owners
- Track upcoming and past bookings

## Tech Stack

- **Frontend**: React Native with Expo
- **State Management**: React Context API
- **Navigation**: React Navigation
- **UI Components**: React Native Paper
- **API Client**: Axios
- **Authentication**: JWT with Secure Storage

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/waggy-mobile.git
cd waggy-mobile
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Start the development server

```bash
npm start
# or
yarn start
```

4. Run on a device or emulator

- Press `a` to run on Android emulator
- Press `i` to run on iOS simulator (macOS only)
- Scan the QR code with the Expo Go app on your physical device

## Project Structure

```
waggy-mobile/
├── src/
│   ├── api/           # API service functions
│   ├── assets/        # Images, fonts, etc.
│   ├── components/    # Reusable UI components
│   ├── context/       # React Context for state management
│   ├── hooks/         # Custom React hooks
│   ├── navigation/    # Navigation configuration
│   └── screens/       # Screen components
│       ├── auth/      # Authentication screens
│       ├── owner/     # Pet owner screens
│       └── sitter/    # Pet sitter screens
├── App.tsx           # Main app component
├── package.json      # Dependencies and scripts
└── tsconfig.json     # TypeScript configuration
```

## Backend API

This app connects to a FastAPI backend service. See the [waggy-api](../waggy-api) repository for the backend code.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
