/**
 * Module 4: Claim Risk Indicator
 */

import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { BarChart3, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import type { ClaimRiskResult } from '@/types/insurance';
import { calculateClaimRisk } from '@/utils/insuranceLogic';

const ClaimRiskPage = () => {

  const [age, setAge] = useState<number | "">("");
  const [claimAmount, setClaimAmount] = useState<number | "">("");
  const [coverageAmount, setCoverageAmount] = useState<number | "">("");
  const [delayDays, setDelayDays] = useState<number | "">("");
  const [previousClaims, setPreviousClaims] = useState<number | "">("");
  const [result, setResult] = useState<ClaimRiskResult | null>(null);

  // GET CURRENT USER
  const user = localStorage.getItem("currentUser");

  // LOAD SAVED HISTORY
  useEffect(() => {

    if (!user) return;

    const saved = localStorage.getItem(`claimRiskHistory_${user}`);

    if (saved) {

      const data = JSON.parse(saved);

      setAge(data.age);
      setClaimAmount(data.claimAmount);
      setCoverageAmount(data.coverageAmount);
      setDelayDays(data.delayDays);
      setPreviousClaims(data.previousClaims);
      setResult(data.result);

    }

  }, [user]);

  const handleAssess = () => {

    if (
      age === "" ||
      claimAmount === "" ||
      coverageAmount === "" ||
      delayDays === "" ||
      previousClaims === ""
    ) {

      alert("Please fill all fields before assessing risk.");
      return;

    }

    const res = calculateClaimRisk(
      Number(age),
      Number(claimAmount),
      Number(coverageAmount),
      Number(delayDays),
      Number(previousClaims)
    );

    setResult(res);

    if (user) {

      localStorage.setItem(
        `claimRiskHistory_${user}`,
        JSON.stringify({
          age,
          claimAmount,
          coverageAmount,
          delayDays,
          previousClaims,
          result: res
        })
      );

    }

  };

  const riskConfig = {

    low: {
      label: 'Low Risk',
      color: 'bg-success',
      textColor: 'text-success',
      icon: CheckCircle,
      bg: 'bg-success/10'
    },

    medium: {
      label: 'Medium Risk',
      color: 'bg-warning',
      textColor: 'text-warning',
      icon: AlertCircle,
      bg: 'bg-warning/10'
    },

    high: {
      label: 'High Risk',
      color: 'bg-destructive',
      textColor: 'text-destructive',
      icon: AlertTriangle,
      bg: 'bg-destructive/10'
    },

  };

  return (

    <AppLayout>

      <div className="container max-w-3xl py-10 px-4">

        <div className="flex items-center gap-3 mb-8">

          <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-warning" />
          </div>

          <div>

            <h1 className="font-display text-2xl font-bold text-foreground">
              Claim Risk Indicator
            </h1>

            <p className="text-sm text-muted-foreground">
              Assess the risk level of insurance claims
            </p>

          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Input Form */}
          <Card className="shadow-card">

            <CardHeader>

              <CardTitle>Claim Details</CardTitle>

              <CardDescription>
                Enter claim parameters for risk assessment
              </CardDescription>

            </CardHeader>

            <CardContent className="space-y-4">

              <div className="space-y-2">

                <Label>Age</Label>

                <Input
                  type="number"
                  value={age}
                  onChange={(e) =>
                    setAge(e.target.value === "" ? "" : Number(e.target.value))
                  }
                />

              </div>

              <div className="space-y-2">

                <Label>Claim Amount (₹)</Label>

                <Input
                  type="number"
                  value={claimAmount}
                  onChange={(e) =>
                    setClaimAmount(e.target.value === "" ? "" : Number(e.target.value))
                  }
                />

              </div>

              <div className="space-y-2">

                <Label>Coverage Amount (₹)</Label>

                <Input
                  type="number"
                  value={coverageAmount}
                  onChange={(e) =>
                    setCoverageAmount(e.target.value === "" ? "" : Number(e.target.value))
                  }
                />

              </div>

              <div className="space-y-2">

                <Label>Delay in Filing (days)</Label>

                <Input
                  type="number"
                  value={delayDays}
                  onChange={(e) =>
                    setDelayDays(e.target.value === "" ? "" : Number(e.target.value))
                  }
                />

              </div>

              <div className="space-y-2">

                <Label>Previous Claims Count</Label>

                <Input
                  type="number"
                  value={previousClaims}
                  onChange={(e) =>
                    setPreviousClaims(e.target.value === "" ? "" : Number(e.target.value))
                  }
                />

              </div>

              <Button
                onClick={handleAssess}
                className="w-full"
                size="lg"
                disabled={
                  age === "" ||
                  claimAmount === "" ||
                  coverageAmount === "" ||
                  delayDays === "" ||
                  previousClaims === ""
                }
              >

                <BarChart3 className="h-4 w-4 mr-2" />

                Assess Risk

              </Button>

            </CardContent>

          </Card>

          {/* Result */}
          <div className="space-y-4">

            {!result ? (

              <Card className="shadow-card h-full flex items-center justify-center">

                <CardContent className="text-center py-12">

                  <BarChart3 className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />

                  <p className="text-sm text-muted-foreground">
                    Enter claim details to see risk assessment.
                  </p>

                </CardContent>

              </Card>

            ) : (

              <Card
                className={`shadow-elevated border-2 ${
                  result.level === 'low'
                    ? 'border-success/30'
                    : result.level === 'medium'
                    ? 'border-warning/30'
                    : 'border-destructive/30'
                }`}
              >

                <CardContent className="pt-6 text-center">

                  {(() => {

                    const config = riskConfig[result.level];
                    const Icon = config.icon;

                    return (

                      <>

                        <div
                          className={`inline-flex items-center justify-center h-16 w-16 rounded-full ${config.bg} mb-4`}
                        >

                          <Icon className={`h-8 w-8 ${config.textColor}`} />

                        </div>

                        <p className="text-4xl font-bold text-foreground mb-1">

                          {result.score}

                          <span className="text-lg text-muted-foreground">
                            /100
                          </span>

                        </p>

                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${config.color} text-primary-foreground`}
                        >

                          {config.label}

                        </span>

                      </>

                    );

                  })()}

                </CardContent>

              </Card>

            )}

          </div>

        </div>

      </div>

    </AppLayout>

  );

};

export default ClaimRiskPage;
