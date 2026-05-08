/**
 * Module 5: Policy Comparison Table
 * Dynamic comparison of Health, Term, and Combined insurance plans.
 */

import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitCompare, Check, AlertCircle } from 'lucide-react';
import { getPolicyPlans } from '@/utils/insuranceLogic';

const PolicyComparisonPage = () => {

  let plans = [];

  try {
    plans = getPolicyPlans();
  } catch (error) {
    console.error("Failed to load policy plans");
  }

  const compareFields = [
    { key: 'coverage', label: 'Coverage Range' },
    { key: 'premiumRange', label: 'Premium Range' },
    { key: 'familyCoverage', label: 'Family Coverage' },
    { key: 'riskProtection', label: 'Risk Protection' },
  ] as const;

  return (
    <AppLayout>

      <div className="container max-w-5xl py-10 px-4">

        <div className="flex items-center gap-3 mb-8">

          <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
            <GitCompare className="h-5 w-5 text-success" />
          </div>

          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Policy Comparison
            </h1>

            <p className="text-sm text-muted-foreground">
              Compare insurance plans side by side to choose the best coverage
            </p>
          </div>

        </div>

        {/* If no plans available */}

        {plans.length === 0 && (
          <Card className="shadow-card text-center py-10">
            <CardContent>
              <AlertCircle className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">
                Unable to load policy plans at the moment.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Desktop Table */}

        {plans.length > 0 && (

          <Card className="shadow-card overflow-hidden hidden md:block">

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead>

                  <tr className="border-b border-border bg-muted/50">

                    <th className="text-left p-4 font-semibold text-foreground">
                      Feature
                    </th>

                    {plans.map((plan) => (

                      <th key={plan.type} className="text-left p-4 font-semibold text-foreground">

                        {plan.name}

                        <Badge variant="secondary" className="ml-2 text-xs capitalize">
                          {plan.type}
                        </Badge>

                      </th>

                    ))}

                  </tr>

                </thead>

                <tbody>

                  {compareFields.map((field) => (

                    <tr key={field.key} className="border-b border-border">

                      <td className="p-4 font-medium text-muted-foreground">
                        {field.label}
                      </td>

                      {plans.map((plan) => (

                        <td key={plan.type} className="p-4 text-foreground">
                          {plan[field.key]}
                        </td>

                      ))}

                    </tr>

                  ))}

                  <tr>

                    <td className="p-4 font-medium text-muted-foreground align-top">
                      Key Benefits
                    </td>

                    {plans.map((plan) => (

                      <td key={plan.type} className="p-4">

                        <ul className="space-y-1.5">

                          {plan.benefits.map((benefit) => (

                            <li key={benefit} className="flex items-start gap-1.5 text-foreground">

                              <Check className="h-3.5 w-3.5 text-success mt-0.5 shrink-0" />

                              {benefit}

                            </li>

                          ))}

                        </ul>

                      </td>

                    ))}

                  </tr>

                </tbody>

              </table>

            </div>

          </Card>

        )}

        {/* Mobile Cards */}

        {plans.length > 0 && (

          <div className="md:hidden space-y-4">

            {plans.map((plan) => (

              <Card key={plan.type} className="shadow-card">

                <CardHeader>

                  <CardTitle className="text-lg flex items-center gap-2">

                    {plan.name}

                    <Badge variant="secondary" className="capitalize text-xs">
                      {plan.type}
                    </Badge>

                  </CardTitle>

                </CardHeader>

                <CardContent className="space-y-3 text-sm">

                  {compareFields.map((field) => (

                    <div key={field.key} className="flex justify-between">

                      <span className="text-muted-foreground">
                        {field.label}
                      </span>

                      <span className="font-medium text-foreground text-right">
                        {plan[field.key]}
                      </span>

                    </div>

                  ))}

                  <div className="pt-2 border-t border-border">

                    <p className="text-muted-foreground mb-2 font-medium">
                      Benefits:
                    </p>

                    <ul className="space-y-1">

                      {plan.benefits.map((benefit) => (

                        <li key={benefit} className="flex items-start gap-1.5">

                          <Check className="h-3.5 w-3.5 text-success mt-0.5 shrink-0" />

                          {benefit}

                        </li>

                      ))}

                    </ul>

                  </div>

                </CardContent>

              </Card>

            ))}

          </div>

        )}

      </div>

    </AppLayout>
  );
};

export default PolicyComparisonPage;