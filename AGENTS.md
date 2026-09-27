# Skill App — Agent Context

## Product
Skill is a teen skill-discovery and growth platform. The core loop is:
Discover → Choose → Learn → Practice → Challenge → Improve → Prove.

## Brand direction
Dark futuristic, glassy/translucent UI, smooth cinematic motion, playful reward moments, abstract geometric identity. Nova is the friendly, adaptive AI smart tutor.

## Current technical state
Expo + React Native + TypeScript. The MVP is intentionally dependency-light and currently lives in App.tsx.

## Safety / secrets
Never place OpenAI API keys, Supabase service-role keys, payment secrets, or other privileged credentials in client code. Use a secure backend/server-side function for privileged API access.

## Before changing architecture
Prefer incremental changes. Keep the app runnable with Expo Go unless a feature genuinely requires native configuration.
