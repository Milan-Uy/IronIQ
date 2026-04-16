"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Minus, Plus, Save, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
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
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const FITNESS_GOALS = [
  { value: "hypertrophy", label: "Hypertrophy" },
  { value: "strength", label: "Strength" },
  { value: "general", label: "General Fitness" },
];

const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const SPLIT_TYPES = [
  { value: "ppl", label: "PPL" },
  { value: "upper_lower", label: "Upper/Lower" },
  { value: "full_body", label: "Full Body" },
];

const WEIGHT_UNITS = [
  { value: "lbs", label: "lbs" },
  { value: "kg", label: "kg" },
];

function getInitials(name: string | null | undefined, email: string | null | undefined): string {
  if (name && name.trim()) {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");
  }
  if (email) return email[0].toUpperCase();
  return "?";
}

const pillBase =
  "rounded-lg border text-sm py-2 px-3 transition-colors cursor-pointer font-normal";
const pillActive = "border-primary bg-primary/10 text-primary font-medium";
const pillInactive =
  "border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setIsAnonymous(user?.is_anonymous ?? false);
      setUserEmail(user?.email ?? null);

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
      } else {
        setProfile({ id: user.id, weight_unit: "lbs" });
      }
      setLoading(false);
    }

    loadProfile();
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    const supabase = createClient();
    const updates = {
      id: profile.id!,
      display_name: profile.display_name ?? null,
      fitness_goal: profile.fitness_goal ?? null,
      experience_level: profile.experience_level ?? null,
      preferred_split: profile.preferred_split ?? null,
      workouts_per_week: profile.workouts_per_week ?? null,
      weight_unit: profile.weight_unit || "lbs",
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase
      .from("profiles")
      .upsert(updates as Database["public"]["Tables"]["profiles"]["Insert"]);

    if (error) {
      setMessage("Failed to save profile");
    } else {
      setMessage("Profile saved!");
    }
    setSaving(false);
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-5rem)] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const initials = getInitials(profile.display_name, userEmail);
  const displayName = profile.display_name || userEmail || "Your Name";

  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 pt-6 pb-20">

      {/* Guest alert */}
      {isAnonymous && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="py-4 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Browsing as a guest</p>
                  <span className="text-xs bg-amber-500/20 text-amber-400 rounded-full px-2 py-0.5">
                    Guest
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Create an account to save your programs and progress permanently.
                </p>
              </div>
              <Link href="/profile/upgrade" className="shrink-0">
                <Button size="sm">
                  <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                  Sign Up
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hero card */}
      <div
        className="rounded-xl border border-white/10 shadow-[var(--shadow-stripe-elevated)] overflow-hidden"
        style={{ background: "var(--gradient-hero), var(--card)" }}
      >
        <div className="flex flex-col items-center gap-3 py-10 px-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-xl font-medium text-primary">{initials}</span>
          </div>
          <div className="text-center">
            <p className="text-2xl tight-display text-foreground">{displayName}</p>
            {userEmail && (
              <p className="mt-1 text-sm text-muted-foreground">{userEmail}</p>
            )}
          </div>
        </div>
      </div>

      {/* Fitness Preferences card */}
      <Card className="shadow-[var(--shadow-stripe-elevated)]">
        <CardHeader>
          <CardTitle className="tight-display text-lg">Fitness Preferences</CardTitle>
          <CardDescription>Personalizes your AI coach recommendations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              placeholder="Your name"
              value={profile.display_name || ""}
              onChange={(e) =>
                setProfile({ ...profile, display_name: e.target.value })
              }
            />
          </div>

          {/* Fitness Goal */}
          <div className="space-y-2">
            <Label>Fitness Goal</Label>
            <div className="grid grid-cols-3 gap-2">
              {FITNESS_GOALS.map((goal) => (
                <button
                  key={goal.value}
                  onClick={() => setProfile({ ...profile, fitness_goal: goal.value })}
                  className={`${pillBase} text-center ${
                    profile.fitness_goal === goal.value ? pillActive : pillInactive
                  }`}
                >
                  {goal.label}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <Label>Experience Level</Label>
            <div className="grid grid-cols-3 gap-2">
              {EXPERIENCE_LEVELS.map((level) => (
                <button
                  key={level.value}
                  onClick={() =>
                    setProfile({ ...profile, experience_level: level.value })
                  }
                  className={`${pillBase} text-center ${
                    profile.experience_level === level.value ? pillActive : pillInactive
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Split */}
          <div className="space-y-2">
            <Label>Preferred Split</Label>
            <div className="grid grid-cols-3 gap-2">
              {SPLIT_TYPES.map((split) => (
                <button
                  key={split.value}
                  onClick={() =>
                    setProfile({ ...profile, preferred_split: split.value })
                  }
                  className={`${pillBase} text-center ${
                    profile.preferred_split === split.value ? pillActive : pillInactive
                  }`}
                >
                  {split.label}
                </button>
              ))}
            </div>
          </div>

          {/* Workouts per Week — stepper */}
          <div className="space-y-2">
            <Label>Workouts per Week</Label>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setProfile({
                    ...profile,
                    workouts_per_week: Math.max(1, (profile.workouts_per_week ?? 3) - 1),
                  })
                }
                className="w-8 h-8 rounded-md border border-border hover:border-primary hover:text-primary transition-colors flex items-center justify-center text-muted-foreground"
                aria-label="Decrease"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-12 text-center text-sm font-medium tabular-nums">
                {profile.workouts_per_week ?? "—"}
              </span>
              <button
                onClick={() =>
                  setProfile({
                    ...profile,
                    workouts_per_week: Math.min(7, (profile.workouts_per_week ?? 3) + 1),
                  })
                }
                className="w-8 h-8 rounded-md border border-border hover:border-primary hover:text-primary transition-colors flex items-center justify-center text-muted-foreground"
                aria-label="Increase"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Weight Unit */}
          <div className="space-y-2">
            <Label>Weight Unit</Label>
            <div className="grid grid-cols-2 gap-2">
              {WEIGHT_UNITS.map((unit) => (
                <button
                  key={unit.value}
                  onClick={() => setProfile({ ...profile, weight_unit: unit.value })}
                  className={`${pillBase} text-center ${
                    profile.weight_unit === unit.value ? pillActive : pillInactive
                  }`}
                >
                  {unit.label}
                </button>
              ))}
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        <Button onClick={handleSave} className="w-full" disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving…" : "Save Profile"}
        </Button>

        {message && (
          <p
            className={`text-center text-sm ${
              message.includes("Failed") ? "text-destructive" : "text-primary"
            }`}
          >
            {message}
          </p>
        )}

        {isAnonymous ? (
          <Dialog>
            <DialogTrigger
              render={
                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground hover:text-destructive"
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
                <DialogClose render={<Button variant="outline" />}>
                  Cancel
                </DialogClose>
                <Link href="/profile/upgrade">
                  <Button>
                    <UserPlus className="mr-1.5 h-4 w-4" />
                    Create Account
                  </Button>
                </Link>
                <Button variant="destructive" onClick={handleSignOut}>
                  Sign Out Anyway
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full text-muted-foreground hover:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        )}
      </div>
    </div>
  );
}
