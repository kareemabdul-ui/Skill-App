# Skill — Teen Skill Discovery & Growth App

A GitHub-ready Expo + React Native MVP for a teen skill-discovery and growth platform.

## Current MVP

The app currently includes:

- Dark futuristic mobile UI
- Home command center
- Discover flow with adaptive-style skill quiz
- Personalized skill recommendations
- Learn screen with bite-sized lessons
- Skill progression and XP
- Daily missions and streaks
- Challenges / competition screen
- Profile and settings UI
- Nova smart-tutor interface (local placeholder responses for now)
- No external UI/navigation dependencies

## Important: what is not connected yet

This is the product UI/MVP layer. These production systems still need to be added:

- Real authentication
- Supabase database
- Server-side OpenAI integration for Nova
- Real course content/CMS
- Cloud progress sync
- Certificates/portfolio storage
- Payments/subscriptions
- Push notifications
- Production analytics

**Never put an OpenAI API key or Supabase service-role key inside `App.tsx`.** Mobile apps are not a safe place for privileged secrets.

## Requirements

Expo currently supports Windows, macOS and Linux development machines. Node.js LTS is recommended by the official Expo documentation.

## Run locally

```bash
npm install
npx expo start
```

Then install Expo Go on your physical Android/iOS device and scan the QR code from the terminal/browser.

You can also use:

```bash
npm run android
npm run ios
npm run web
npm run typecheck
npm run doctor
```

## GitHub workflow

After downloading this project:

```bash
git init
git add .
git commit -m "Initial Skill MVP"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Or create an empty GitHub repository first and use the GitHub-provided commands.

## Development roadmap

1. Polish MVP UI/UX
2. Add Supabase authentication
3. Add user/profile/progress database
4. Connect Nova through a secure backend
5. Build real course/lesson content
6. Add challenges, submissions and certificates
7. Add parent account/payment flow
8. Add analytics and notifications
9. Prepare Android/iOS production builds

## Project structure

```text
skill-growth-app/
├── App.tsx
├── app.json
├── package.json
├── tsconfig.json
├── eas.json
├── .env.example
├── .gitignore
└── README.md
```

The project intentionally starts small. As the product grows, App.tsx should be split into screens, components, services and data modules.
