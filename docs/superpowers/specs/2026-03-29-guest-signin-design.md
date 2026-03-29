# Guest Sign-In Design

## Context

Users should be able to try IronIQ without creating an account. A "Continue as Guest" option on the login page creates an anonymous Supabase session with full app access. Guests are prompted to upgrade to a real account before their data is lost on sign-out.

## Approach: Supabase Anonymous Auth

Supabase provides built-in anonymous authentication via `signInAnonymously()`. Anonymous users get a real user ID and session, so all existing app features (programs, workouts, coach, insights) work without modification. The upgrade path uses `updateUser()` / `linkIdentity()` to convert the anonymous account to a permanent one, preserving the same user ID and all associated data.

## Changes

### 1. Supabase Dashboard Configuration

Enable **Allow anonymous sign-ins** in Supabase Authentication settings. No schema or migration changes needed.

### 2. Login Page (`src/app/(auth)/login/page.tsx`)

Add a "Continue as Guest" button below the existing "or" divider. Calls `supabase.auth.signInAnonymously()`. On success, redirects to `/program` (not `/coach` — guests land on the program tab). Styled as a ghost/secondary button to visually differentiate from primary auth options.

### 3. Profile Page (`src/app/(app)/profile/page.tsx`)

- **Upgrade banner**: When `user.is_anonymous === true`, show a banner at the top: "You're browsing as a guest. Create an account to save your progress." with a link to `/profile/upgrade`.
- **Sign-out confirmation**: When an anonymous user clicks "Sign Out", show a confirmation dialog warning that all data will be lost. Options: "Create Account" (goes to upgrade) or "Sign Out" (proceeds with sign-out).
- **Guest badge**: Show a "Guest" badge near the top of the profile page for anonymous users.

### 4. Account Upgrade Page (`src/app/(app)/profile/upgrade/page.tsx`) — NEW

A form allowing the guest to convert their anonymous account to a permanent one:

- **Email/password**: Calls `supabase.auth.updateUser({ email, password })`.
- **Google OAuth**: Calls `supabase.auth.linkIdentity({ provider: 'google', options: { redirectTo: '...' } })`.
- On success, redirect back to `/profile` with a success message. The user ID remains the same — all existing data is preserved.

### 5. Middleware (`src/lib/supabase/middleware.ts`)

No changes needed. Anonymous users are valid authenticated users — the existing middleware already handles them correctly.

## Files Summary

| File | Action |
|------|--------|
| `src/app/(auth)/login/page.tsx` | Modify — add guest sign-in button |
| `src/app/(app)/profile/page.tsx` | Modify — add upgrade banner, sign-out guard, guest badge |
| `src/app/(app)/profile/upgrade/page.tsx` | Create — account upgrade form |

## Verification

1. Click "Continue as Guest" on login page → redirected to `/program` with full app access
2. Create a program, track a workout as guest → data persists during session
3. Visit `/profile` → see "Guest" badge and upgrade banner
4. Click "Sign Out" as guest → confirmation dialog warns about data loss
5. Choose "Create Account" from dialog → navigate to upgrade page
6. Upgrade via email/password → account becomes permanent, all data preserved
7. Upgrade via Google OAuth → same result
8. After upgrade, guest banner and badge no longer appear
