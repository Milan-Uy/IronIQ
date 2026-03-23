"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const FITNESS_GOALS = [
  { value: "hypertrophy", label: "Hypertrophy (Muscle Growth)" },
  { value: "strength", label: "Strength" },
  { value: "general", label: "General Fitness" },
];

const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const SPLIT_TYPES = [
  { value: "ppl", label: "Push/Pull/Legs" },
  { value: "upper_lower", label: "Upper/Lower" },
  { value: "full_body", label: "Full Body" },
];

const WEIGHT_UNITS = [
  { value: "lbs", label: "Pounds (lbs)" },
  { value: "kg", label: "Kilograms (kg)" },
];

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

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

  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 py-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fitness Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Fitness Goal</Label>
            <div className="grid grid-cols-1 gap-2">
              {FITNESS_GOALS.map((goal) => (
                <button
                  key={goal.value}
                  onClick={() =>
                    setProfile({ ...profile, fitness_goal: goal.value })
                  }
                  className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                    profile.fitness_goal === goal.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  {goal.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Experience Level</Label>
            <div className="grid grid-cols-3 gap-2">
              {EXPERIENCE_LEVELS.map((level) => (
                <button
                  key={level.value}
                  onClick={() =>
                    setProfile({ ...profile, experience_level: level.value })
                  }
                  className={`rounded-lg border px-3 py-2 text-center text-sm transition-colors ${
                    profile.experience_level === level.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Preferred Split</Label>
            <div className="grid grid-cols-1 gap-2">
              {SPLIT_TYPES.map((split) => (
                <button
                  key={split.value}
                  onClick={() =>
                    setProfile({ ...profile, preferred_split: split.value })
                  }
                  className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                    profile.preferred_split === split.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  {split.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workoutsPerWeek">Workouts per Week</Label>
            <Input
              id="workoutsPerWeek"
              type="number"
              min={1}
              max={7}
              placeholder="3-6"
              value={profile.workouts_per_week || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  workouts_per_week: parseInt(e.target.value) || null,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Weight Unit</Label>
            <div className="grid grid-cols-2 gap-2">
              {WEIGHT_UNITS.map((unit) => (
                <button
                  key={unit.value}
                  onClick={() =>
                    setProfile({ ...profile, weight_unit: unit.value })
                  }
                  className={`rounded-lg border px-3 py-2 text-center text-sm transition-colors ${
                    profile.weight_unit === unit.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  {unit.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {message && (
        <p
          className={`text-center text-sm ${
            message.includes("Failed") ? "text-destructive" : "text-primary"
          }`}
        >
          {message}
        </p>
      )}

      <Button onClick={handleSave} className="w-full" disabled={saving}>
        <Save className="mr-2 h-4 w-4" />
        {saving ? "Saving..." : "Save Profile"}
      </Button>

      <Separator />

      <Button
        variant="outline"
        onClick={handleSignOut}
        className="w-full text-destructive hover:text-destructive"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
}
