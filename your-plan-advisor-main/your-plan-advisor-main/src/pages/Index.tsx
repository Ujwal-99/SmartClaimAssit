/**
 * Home/Landing Page
 * Entry point for the Smart ClaimAssist system with navigation to all modules.
 */

import { Link } from 'react-router-dom';
import { User, Calculator, Shield, BarChart3, GitCompare, MessageSquare, ArrowRight } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const modules = [
  {
    path: '/profile',
    icon: User,
    title: 'User Profile',
    description: 'Enter your personal details for personalized insurance recommendations.',
    color: 'bg-primary/10 text-primary',
  },
  {
    path: '/recommend',
    icon: Shield,
    title: 'Plan Recommendation',
    description: 'Get AI-powered insurance plan suggestions based on your profile.',
    color: 'bg-accent/10 text-accent',
  },
  {
    path: '/premium',
    icon: Calculator,
    title: 'Premium Calculator',
    description: 'Calculate your insurance premium with detailed breakdowns.',
    color: 'bg-info/10 text-info',
  },
  {
    path: '/risk',
    icon: BarChart3,
    title: 'Claim Risk Indicator',
    description: 'Assess the risk level of your insurance claims.',
    color: 'bg-warning/10 text-warning',
  },
  {
    path: '/compare',
    icon: GitCompare,
    title: 'Policy Comparison',
    description: 'Compare different insurance plans side by side.',
    color: 'bg-success/10 text-success',
  },
  {
    path: '/chat',
    icon: MessageSquare,
    title: 'Chat Assistant',
    description: 'Ask questions about insurance with our knowledge-based chatbot.',
    color: 'bg-destructive/10 text-destructive',
  },
];

const Index = () => {
  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="gradient-hero py-20 px-4">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-primary-foreground mb-6">
            <Shield className="h-4 w-4" />
            AI-Powered Insurance Assistant
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary-foreground mb-4">
            Smart ClaimAssist
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            A conversational interface for insurance services — plan recommendations, 
            premium calculations, risk assessment, and more.
          </p>
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 rounded-lg gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elevated transition-transform hover:scale-105"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="container py-16 px-4">
        <h2 className="font-display text-2xl font-bold text-foreground text-center mb-2">
          System Modules
        </h2>
        <p className="text-muted-foreground text-center mb-10">
          Explore all features of the Smart ClaimAssist system
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link key={mod.path} to={mod.path}>
                <Card className="h-full transition-all hover:shadow-elevated hover:-translate-y-1 cursor-pointer border border-border">
                  <CardHeader>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${mod.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{mod.title}</CardTitle>
                    <CardDescription>{mod.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

     
    </AppLayout>
  );
};

export default Index;
