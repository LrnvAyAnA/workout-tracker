# Workour-tracker

A mobile-first workout tracking application built with React, Ionic, and Capacitor.

The app helps users track workouts, exercises, sets, repetitions, and weights with local data storage.

## Demo

Web: [Live Demo](https://workout-fuphx685x-lrnvayanas-projects.vercel.app)

Android APK: [Download APK](https://github.com/LrnvAyAnA/workout-tracker/releases/download/v1.0.0/app-debug.apk)

> The web version uses mock data for demonstration purposes.  
> The Android application uses SQLite for local data storage.

## Features

- Create and manage workouts
- Add exercises to workouts
- Track sets, repetitions, and weights
- Edit and delete sets
- Workout history with calendar view
- Exercise categories
- Personal records (PR)
- Last used weight tracking

## Tech Stack

- React
- TypeScript
- Ionic React
- Capacitor
- SQLite
- Vite
- CSS Modules

## Screenshots
### Workout calendar
<img width="191" height="400" alt="image" src="https://github.com/user-attachments/assets/506d804c-e1f6-4205-a25d-db5695318b80" />

### Exercise library
<img width="188" height="400" alt="image" src="https://github.com/user-attachments/assets/0e392190-cf86-421e-808f-df207792f5db" />

### Workout history
<img width="190" height="400" alt="image" src="https://github.com/user-attachments/assets/3cde4b01-3532-4174-924e-b25ae9017660" />

### Exercise selection
<img width="192" height="400" alt="image" src="https://github.com/user-attachments/assets/e1d13778-6705-49b5-a751-f7cfd9af9e6c" />

### Add/edit exercise
<img width="190" height="400" alt="image" src="https://github.com/user-attachments/assets/e20f9d5e-b404-4fca-b91b-c250f919165d" />

## Database

Main entities:
- `workouts` — workout sessions
- `exercises` — available exercises
- `categories` — exercise categories
- `sets` — performed sets with weight and repetitions

## Project Structure
``` text
src/
├── components/
├── pages/
├── database/
│ ├── repositories/
│ ├── schema/
│ └── migrations/
├── types/
└── utils/
```

## Running Locally
Clone the repository:
```bash
git clone https://github.com/LrnvAyAnA/workout-tracker.git
cd workout-tracker
```
Install dependencies:
```bash
npm install
```
Start development server:
```bash
npm run dev
```
## Android Build

```bash
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```
