/**
 * Module 3: Premium Calculator
 */

import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, IndianRupee } from 'lucide-react';
import type { PlanType, PremiumResult } from '@/types/insurance';
import { calculatePremium } from '@/utils/insuranceLogic';

const PremiumCalculatorPage = () => {

  const [policyType, setPolicyType] = useState<PlanType>('health');
  const [coverageAmount, setCoverageAmount] = useState<number | "">("");
  const [age, setAge] = useState<number | "">("");
  const [result, setResult] = useState<PremiumResult | null>(null);

  const user = localStorage.getItem("currentUser");

  useEffect(() => {

    if (!user) return;

    const saved = localStorage.getItem(`premiumHistory_${user}`);

    if (saved) {
      const data = JSON.parse(saved);

      setPolicyType(data.policyType);
      setCoverageAmount(data.coverageAmount);
      setAge(data.age);
      setResult(data.result);
    }

  }, [user]);

  const handleCalculate = () => {

    if (coverageAmount === "" || age === "") {
      alert("Please fill all fields before calculating premium.");
      return;
    }

    const res = calculatePremium(
      policyType,
      Number(coverageAmount),
      Number(age)
    );

    setResult(res);

    if (user) {
      localStorage.setItem(`premiumHistory_${user}`, JSON.stringify({
        policyType,
        coverageAmount,
        age,
        result: res
      }));
    }

  };

  const policyLabels: Record<PlanType, string> = {
    health: 'Health Insurance',
    term: 'Term Life Insurance',
    combined: 'Combined Protection',
  };

  return (

    <AppLayout>

      <div className="container max-w-3xl py-10 px-4">

        <div className="flex items-center gap-3 mb-8">

          <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
            <Calculator className="h-5 w-5 text-info" />
          </div>

          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Premium Calculator
            </h1>

            <p className="text-sm text-muted-foreground">
              Calculate your insurance premium instantly
            </p>
          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* INPUT CARD */}

          <Card className="shadow-card">

            <CardHeader>
              <CardTitle>Enter Details</CardTitle>
              <CardDescription>
                Select policy type and enter your details
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">

              <div className="space-y-2">
                <Label>Policy Type</Label>

                <Select
                  value={policyType}
                  onValueChange={(v) => setPolicyType(v as PlanType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="health">Health Insurance</SelectItem>
                    <SelectItem value="term">Term Life Insurance</SelectItem>
                    <SelectItem value="combined">Combined Protection</SelectItem>
                  </SelectContent>

                </Select>
              </div>

              <div className="space-y-2">
                <Label>Coverage Amount (₹)</Label>

                <Input
                  type="number"
                  value={coverageAmount}
                  onChange={(e) =>
                    setCoverageAmount(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Age</Label>

                <Input
                  type="number"
                  value={age}
                  onChange={(e) =>
                    setAge(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                />
              </div>

              <Button onClick={handleCalculate} className="w-full">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Premium
              </Button>

            </CardContent>

          </Card>

          {/* RESULT CARD */}

          <Card className={`shadow-card ${result ? 'border-2 border-primary/20' : ''}`}>

            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5" />
                Premium Breakdown
              </CardTitle>
            </CardHeader>

            <CardContent>

              {!result ? (

                <p className="text-center text-muted-foreground py-10">
                  Enter details to see premium
                </p>

              ) : (

                <div className="space-y-4">

                  <p className="text-sm text-muted-foreground">
                    {policyLabels[result.policyType]} • Coverage: ₹{result.coverageAmount.toLocaleString('en-IN')}
                  </p>

                  {/* Breakdown */}

                  <div className="text-sm space-y-2">
                    <p>Base Premium: ₹{result.basePremium}</p>
                    <p>Age Factor: ₹{result.ageFactor}</p>
                    <p>Coverage Factor: ₹{result.coverageFactor}</p>
                  </div>

                  {/* Final Premium */}

                  <div className="bg-blue-600 text-white p-4 rounded-lg text-center">

                    <p className="text-xs opacity-80">
                      Annual Premium
                    </p>

                    <p className="text-2xl font-bold">
                      ₹{result.totalPremium.toLocaleString('en-IN')}
                    </p>

                    <p className="text-xs mt-1 opacity-80">
                      ≈ ₹{Math.round(result.totalPremium / 12).toLocaleString('en-IN')} / month
                    </p>

                  </div>

                </div>

              )}

            </CardContent>

          </Card>

        </div>

      </div>

    </AppLayout>

  );

};

export default PremiumCalculatorPage;