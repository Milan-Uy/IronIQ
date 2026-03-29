# Guest Sign-In Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow users to try IronIQ without creating an account, with an upgrade path to preserve their data.

**Architecture:** Uses Supabase's built-in anonymous auth (`signInAnonymously()`). Anonymous users get a real session and user ID, so all existing app code works unchanged. Upgrade converts the anonymous account in-place via `updateUser()` / `linkIdentity()`, preserving the same user ID and all associated data.

**Tech Stack:** Supabase Anonymous Auth, Next.js App Router, React, shadcn/ui Dialog + Badge components

**Prerequisite:** Enable "Allow anonymous sign-ins" in Supabase Dashboard → Authentication → Settings.

---

### Task 1: Add "Continue as Guest" Button to Login Page

**Files:**
- Modify: `src/app/(auth)/login/page.tsx`

- [ ] **Step 1: Add guest sign-in handler function**

Inside the `LoginPage` component, after the `handleGoogleLogin` function (line 48), add:

```tsx
async function handleGuestLogin() {
  setError(null);
  setLoading(true);

  const supabase = createClient();
  const { error } = await supabase.auth.signInAnonymously();

  if (error) {
    setError(error.message);
    setLoading(false);
    return;
  }

  router.push("/program");
  router.refresh();
}
```

- [ ] **Step 2: Add the guest button to the UI**

After the closing `</form>` tag (line 131), add a second "or" divider and the guest button:

```tsx
<div className="relative">
  <div className="absolute inset-0 flex items-center">
    <span className="w-full border-t" />
  </div>
  <div className="relative flex justify-center text-xs uppercase">
    <span className="bg-card px-2 text-muted-foreground">or</span>
  </div>
</div>

<Button
  variant="ghost"
  className="w-full"
  onClick={handleGuestLogin}
  disabled={loading}
>
  Continue as Guest
</Button>
```

- [ ] **Step 3: Verify manually**

Run: `npm run dev`

1. Navigate to `/login`
2. Click "Continue as Guest"
3. Confirm redirect to `/program`
4. Confirm the app works normally (can browse programs, etc.)

- [ ] **Step 4: Commit**

```bash
git add src/app/(auth)/login/page.tsx
git commit -m "feat: add continue as guest button to login page"
```

---

### Task 2: Add Guest Badge and Upgrade Banner to Profile Page

**Files:**
- Modify: `src/app/(app)/profile/page.tsx`

- [ ] **Step 1: Add imports**

Add to the existing imports at the top of the file:

```tsx
import { LogOut, Save, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
```

Remove `LogOut` and `Save` from the existing lucide import since they're now in the combined import. Keep the existing `createClient` and other imports.

- [ ] **Step 2: Add isAnonymous state and detection**

Inside the `ProfilePage` component, add a new state variable after the existing state declarations (after line 44):

```tsx
const [isAnonymous, setIsAnonymous] = useState(false);
```

Inside the `loadProfile` `useEffect`, after `const { data: { user } } = await supabase.auth.getUser();` (line 52), add:

```tsx
setIsAnonymous(user?.is_anonymous ?? false);
```

- [ ] **Step 3: Add guest banner UI**

In the return JSX, after the `<h1>` tag (line 116), add:

```tsx
{isAnonymous && (
  <Card className="border-primary/50 bg-primary/5">
    <CardContent className="flex items-center justify-between gap-4 py-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">You&apos;re browsing as a guest</p>
          <Badge variant="secondary">Guest</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Create an account to save your progress.
        </p>
      </div>
      <Link href="/profile/upgrade">
        <Button size="sm">
          <UserPlus className="mr-1.5 h-3.5 w-3.5" />
          Sign Up
        </Button>
      </Link>
    </CardContent>
  </Card>
)}
```

- [ ] **Step 4: Verify manually**

Run: `npm run dev`

1. Sign in as guest
2. Navigate to `/profile`
3. Confirm the guest banner appears with "Guest" badge and "Sign Up" link
4. Sign in with a real account, confirm the banner does NOT appear

- [ ] **Step 5: Commit**

```bash
git add src/app/(app)/profile/page.tsx
git commit -m "feat: add guest banner and badge to profile page"
```

---

### Task 3: Add Sign-Out Confirmation Dialog for Guest Users

**Files:**
- Modify: `src/app/(app)/profile/page.tsx`

- [ ] **Step 1: Add dialog imports**

Add to the imports at the top of the file:

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
```

- [ ] **Step 2: Replace the sign-out button**

Replace the existing sign-out button block (the `<Button variant="outline" onClick={handleSignOut} ...>` near line 263) with:

```tsx
{isAnonymous ? (
  <Dialog>
    <DialogTrigger
      render={
        <Button
          variant="outline"
          className="w-full text-destructive hover:text-destructive"
        />
      }
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Sign out as guest?</DialogTitle>
        <DialogDescription>
          All your data (programs, workouts, progress) will be permanently
          lost. Create an account first to save your progress.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose
          render={<Button variant="outline" />}
        >
          Cancel
        </DialogClose>
        <Link href="/profile/upgrade">
          <Button>
            <UserPlus className="mr-1.5 h-4 w-4" />
            Create Account
          </Button>
        </Link>
        <Button
          variant="destructive"
          onClick={handleSignOut}
        >
          Sign Out Anyway
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
) : (
  <Button
    variant="outline"
    onClick={handleSignOut}
    className="w-full text-destructive hover:text-destructive"
  >
    <LogOut className="mr-2 h-4 w-4" />
    Sign Out
  </Button>
)}
```

- [ ] **Step 3: Verify manually**

Run: `npm run dev`

1. Sign in as guest → go to `/profile`
2. Click "Sign Out" → confirmation dialog appears
3. Confirm "Cancel" closes dialog
4. Confirm "Create Account" navigates to `/profile/upgrade`
5. Confirm "Sign Out Anyway" signs out and redirects to `/login`
6. Sign in with real account → "Sign Out" works without dialog

- [ ] **Step 4: Commit**

```bash
git add src/app/(app)/profile/page.tsx
git commit -m "feat: add sign-out confirmation dialog for guest users"
```

---

### Task 4: Create Account Upgrade Page

**Files:**
- Create: `src/app/(app)/profile/upgrade/page.tsx`

- [ ] **Step 1: Create the upgrade page**

Create `src/app/(app)/profile/upgrade/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function UpgradePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpgrade(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    toast.success("Account created! Your data has been saved.");
    router.push("/profile");
    router.refresh();
  }

  async function handleGoogleUpgrade() {
    const supabase = createClient();
    const { error } = await supabase.auth.linkIdentity({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 py-6">
      <div className="flex items-center gap-3">
        <Link href="/profile">
          <Button variant="ghost" size="icon-sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Create Account</h1>
      </div>

      <p className="text-sm text-muted-foreground">
        Save your progress by creating a permanent account. All your existing
        programs and workout data will be preserved.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sign up with Google</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleUpgrade}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>
        </CardContent>
      </Card>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            or
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sign up with email</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpgrade} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Verify manually**

Run: `npm run dev`

1. Sign in as guest → go to `/profile` → click "Sign Up" in the banner
2. Confirm redirect to `/profile/upgrade`
3. Test email/password upgrade:
   - Fill in email, password, confirm password
   - Submit → should show success toast and redirect to `/profile`
   - Guest banner should no longer appear
4. Test Google upgrade (separate guest session):
   - Click "Continue with Google" → Google OAuth flow → returns to app
   - Guest banner should no longer appear
5. Confirm back arrow navigates to `/profile`

- [ ] **Step 3: Commit**

```bash
git add src/app/(app)/profile/upgrade/page.tsx
git commit -m "feat: add account upgrade page for guest users"
```

---

### Task 5: Build Verification and Final Check

- [ ] **Step 1: Run lint**

```bash
npm run lint
```

Fix any lint errors if found.

- [ ] **Step 2: Run build**

```bash
npm run build
```

Fix any type or build errors if found.

- [ ] **Step 3: End-to-end manual verification**

1. `/login` → "Continue as Guest" → redirects to `/program`
2. Create a program as guest → data persists
3. `/profile` → guest banner visible with badge
4. Click "Sign Out" → confirmation dialog appears
5. Click "Create Account" → navigates to `/profile/upgrade`
6. Complete email/password upgrade → success toast, redirected to `/profile`, no guest banner
7. Sign out → sign back in with email/password → data from guest session is preserved
8. `/login` as non-guest → no guest-related UI visible

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: address lint and build issues for guest sign-in"
```
