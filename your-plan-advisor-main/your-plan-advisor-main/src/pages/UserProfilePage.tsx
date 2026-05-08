/**
 * Module 1: User Profile
 * Collects and stores user details for insurance recommendations.
 * Validates all inputs and persists data to localStorage.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { User, Save, CheckCircle } from "lucide-react";
import type { UserProfile } from "@/types/insurance";

const UserProfilePage = () => {

  const { toast } = useToast();
  const navigate = useNavigate();

  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    age: "" as number | "",
    monthlyIncome: "" as number | "",
    hasHealthIssues: false,
    familySize: "" as number | "",
    maritalStatus: "single" as UserProfile["maritalStatus"],
  });

  // Logged in user
  const userEmail = localStorage.getItem("currentUser");

  const profileKey = `profile_${userEmail}`;

  // Load existing profile
  useEffect(() => {

    if (!userEmail) {
      navigate("/login");
      return;
    }

    const stored = localStorage.getItem(profileKey);

    if (stored) {
      try {

        const parsed = JSON.parse(stored) as UserProfile;

        setProfile({
          name: parsed.name,
          age: parsed.age,
          monthlyIncome: parsed.monthlyIncome,
          hasHealthIssues: parsed.hasHealthIssues,
          familySize: parsed.familySize,
          maritalStatus: parsed.maritalStatus,
        });

        setSaved(true);

      } catch (err) {

        console.error("Invalid stored profile");
        localStorage.removeItem(profileKey);

      }
    }

  }, [userEmail, navigate, profileKey]);

  const handleSave = () => {

    if (!userEmail) {
      toast({
        title: "Login Required",
        description: "Please login first.",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    if (!profile.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your name.",
        variant: "destructive"
      });
      return;
    }

    if (profile.age === "" || profile.age < 18 || profile.age > 100) {
      toast({
        title: "Validation Error",
        description: "Age must be between 18 and 100.",
        variant: "destructive"
      });
      return;
    }

    if (profile.monthlyIncome === "" || profile.monthlyIncome < 0) {
      toast({
        title: "Validation Error",
        description: "Please enter valid monthly income.",
        variant: "destructive"
      });
      return;
    }

    if (profile.familySize === "" || profile.familySize < 1 || profile.familySize > 20) {
      toast({
        title: "Validation Error",
        description: "Family size must be between 1 and 20.",
        variant: "destructive"
      });
      return;
    }

    const fullProfile: UserProfile = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      name: profile.name,
      age: Number(profile.age),
      monthlyIncome: Number(profile.monthlyIncome),
      familySize: Number(profile.familySize),
      hasHealthIssues: profile.hasHealthIssues,
      maritalStatus: profile.maritalStatus,
    };

    localStorage.setItem(profileKey, JSON.stringify(fullProfile));

    setSaved(true);

    toast({
      title: "Profile Saved",
      description: "Your profile has been saved successfully."
    });

  };

  return (

    <AppLayout>

      <div className="container max-w-2xl py-10 px-4">

        <div className="flex items-center gap-3 mb-8">

          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>

          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              User Profile
            </h1>

            <p className="text-sm text-muted-foreground">
              Enter your details for personalized recommendations
            </p>
          </div>

        </div>

        <Card className="shadow-card">

          <CardHeader>

            <CardTitle>Personal Information</CardTitle>

            <CardDescription>
              All fields are required for accurate plan recommendations.
            </CardDescription>

          </CardHeader>

          <CardContent className="space-y-6">

            {/* Name */}

            <div className="space-y-2">

              <Label htmlFor="name">Full Name</Label>

              <Input
                id="name"
                placeholder="Enter your full name"
                value={profile.name}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    name: e.target.value
                  })
                }
              />

            </div>

            {/* Age + Income */}

            <div className="grid grid-cols-2 gap-4">

              <div className="space-y-2">

                <Label htmlFor="age">Age</Label>

                <Input
                  id="age"
                  type="number"
                  min={18}
                  max={100}
                  placeholder="Enter age"
                  value={profile.age}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      age: e.target.value === "" ? "" : Number(e.target.value)
                    })
                  }
                />

              </div>

              <div className="space-y-2">

                <Label htmlFor="income">Monthly Income (₹)</Label>

                <Input
                  id="income"
                  type="number"
                  min={0}
                  placeholder="Enter income"
                  value={profile.monthlyIncome}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      monthlyIncome: e.target.value === "" ? "" : Number(e.target.value)
                    })
                  }
                />

              </div>

            </div>

            {/* Family + Marital */}

            <div className="grid grid-cols-2 gap-4">

              <div className="space-y-2">

                <Label htmlFor="familySize">Family Size</Label>

                <Input
                  id="familySize"
                  type="number"
                  min={1}
                  max={20}
                  placeholder="Enter family size"
                  value={profile.familySize}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      familySize: e.target.value === "" ? "" : Number(e.target.value)
                    })
                  }
                />

              </div>

              <div className="space-y-2">

                <Label>Marital Status</Label>

                <Select
                  value={profile.maritalStatus}
                  onValueChange={(val) =>
                    setProfile({
                      ...profile,
                      maritalStatus: val as UserProfile["maritalStatus"]
                    })
                  }
                >

                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>

                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>

                  </SelectContent>

                </Select>

              </div>

            </div>

            {/* Health */}

            <div className="flex items-center justify-between rounded-lg border border-border p-4">

              <div>

                <Label className="text-sm font-medium">
                  Existing Health Issues
                </Label>

                <p className="text-xs text-muted-foreground">
                  Do you have any pre-existing medical conditions?
                </p>

              </div>

              <Switch
                checked={profile.hasHealthIssues}
                onCheckedChange={(checked) =>
                  setProfile({
                    ...profile,
                    hasHealthIssues: checked
                  })
                }
              />

            </div>

            {/* Save */}

            <Button onClick={handleSave} className="w-full" size="lg">

              {saved
                ? <CheckCircle className="h-4 w-4 mr-2" />
                : <Save className="h-4 w-4 mr-2" />
              }

              {saved ? "Update Profile" : "Save Profile"}

            </Button>

            {saved && (

              <p className="text-center text-sm text-green-600">
                ✓ Profile saved. You can now use the Recommendation module.
              </p>

            )}

          </CardContent>

        </Card>

      </div>

    </AppLayout>

  );

};

export default UserProfilePage;