/**
 * Module 2: Insurance Plan Recommendation Engine
 * Uses rule-based decision logic to recommend the best plan
 * based on the user's stored profile.
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ArrowRight, User, AlertCircle } from 'lucide-react';
import type { UserProfile, PlanRecommendation } from '@/types/insurance';
import { recommendPlan } from '@/utils/insuranceLogic';

const PlanRecommendationPage = () => {

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recommendation, setRecommendation] = useState<PlanRecommendation | null>(null);

  const navigate = useNavigate();

  useEffect(() => {

    // Get logged in user
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
      navigate("/login");
      return;
    }

    // Load profile specific to user
    const profileKey = `profile_${currentUser}`;

    const stored = localStorage.getItem(profileKey);

    if (stored) {

      try {

        const parsed = JSON.parse(stored) as UserProfile;

        setProfile(parsed);

        setRecommendation(recommendPlan(parsed));

      } catch (error) {

        console.error("Invalid profile data in localStorage");

        localStorage.removeItem(profileKey);

      }

    }

  }, [navigate]);

  if (!profile) {
    return (
      <AppLayout>
        <div className="container max-w-2xl py-20 px-4 text-center">

          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />

          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            No Profile Found
          </h1>

          <p className="text-muted-foreground mb-6">
            Please create your profile first to get recommendations.
          </p>

          <Link to="/profile">
            <Button>
              <User className="h-4 w-4 mr-2" />
              Go to Profile
            </Button>
          </Link>

        </div>
      </AppLayout>
    );
  }

  return (

    <AppLayout>

      <div className="container max-w-3xl py-10 px-4">

        <div className="flex items-center gap-3 mb-8">

          <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-accent" />
          </div>

          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Plan Recommendation
            </h1>

            <p className="text-sm text-muted-foreground">
              AI-powered rule engine analysis for your profile
            </p>
          </div>

        </div>

        {/* Profile Summary */}

        <Card className="mb-6 shadow-card">

          <CardHeader>
            <CardTitle className="text-base">
              Your Profile Summary
            </CardTitle>
          </CardHeader>

          <CardContent>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">

              <div>
                <span className="text-muted-foreground">Name:</span>
                <strong> {profile.name}</strong>
              </div>

              <div>
                <span className="text-muted-foreground">Age:</span>
                <strong> {profile.age}</strong>
              </div>

              <div>
                <span className="text-muted-foreground">Income:</span>
                <strong> ₹{profile.monthlyIncome.toLocaleString('en-IN')}</strong>
              </div>

              <div>
                <span className="text-muted-foreground">Family Size:</span>
                <strong> {profile.familySize}</strong>
              </div>

              <div>
                <span className="text-muted-foreground">Status:</span>
                <strong className="capitalize"> {profile.maritalStatus}</strong>
              </div>

              <div>
                <span className="text-muted-foreground">Health Issues:</span>
                <strong> {profile.hasHealthIssues ? 'Yes' : 'No'}</strong>
              </div>

            </div>

          </CardContent>

        </Card>

        {/* Recommendation Result */}

        {recommendation && (

          <Card className="shadow-elevated border-2 border-primary/20">

            <CardContent className="pt-8 pb-8">

              <div className="text-center mb-6">

                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
                  Confidence: {recommendation.confidence.toUpperCase()}
                </div>

                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  {recommendation.planName}
                </h2>

                <span className="inline-block rounded-md bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground capitalize">
                  {recommendation.planType} Plan
                </span>

              </div>

              <div className="rounded-lg bg-muted p-4 text-sm text-foreground">

                <p className="font-medium mb-1">
                  Why this plan?
                </p>

                <p className="text-muted-foreground">
                  {recommendation.reason}
                </p>

              </div>

              <div className="flex gap-3 mt-6 justify-center">

                <Link to="/premium">
                  <Button>
                    Calculate Premium
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>

                <Link to="/compare">
                  <Button variant="outline">
                    Compare Plans
                  </Button>
                </Link>

              </div>

            </CardContent>

          </Card>

        )}

        {!recommendation && (

          <Card className="shadow-card">

            <CardContent className="text-center py-8">

              <p className="text-muted-foreground">
                Unable to generate recommendation. Please update your profile.
              </p>

            </CardContent>

          </Card>

        )}

        {/* Decision Logic Explanation */}

        <Card className="mt-6 shadow-card">

          <CardHeader>
            <CardTitle className="text-base">
              Decision Logic Rules
            </CardTitle>
          </CardHeader>

          <CardContent className="text-sm text-muted-foreground space-y-2">

            <p>• If existing health issues → <strong>Specialized Health Plan</strong></p>
            <p>• If income &gt; ₹50,000 & dependents exist → <strong>Combined Plan</strong></p>
            <p>• If family size &gt; 2 → <strong>Family Floater Health Plan</strong></p>
            <p>• If age &lt; 35 & no health issues → <strong>Term Life Plan</strong></p>
            <p>• Age 35-50 → <strong>Combined Plan</strong></p>
            <p>• Age 50+ → <strong>Senior Health Plan</strong></p>

          </CardContent>

        </Card>

      </div>

    </AppLayout>

  );
};

export default PlanRecommendationPage;