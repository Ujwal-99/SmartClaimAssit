/**
 * AppLayout Component
 * Provides consistent navigation and layout structure across all modules.
 */

import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  User,
  Calculator,
  Shield,
  BarChart3,
  GitCompare,
  MessageSquare,
  Home,
  LogOut
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/recommend', label: 'Recommend', icon: Shield },
  { path: '/premium', label: 'Premium', icon: Calculator },
  { path: '/risk', label: 'Risk', icon: BarChart3 },
  { path: '/compare', label: 'Compare', icon: GitCompare },
  { path: '/chat', label: 'Chat', icon: MessageSquare },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {

  const location = useLocation();
  const navigate = useNavigate();

  // Logged in user
  const currentUser = localStorage.getItem("currentUser");

  // 🔴 Logout ONLY navigates (no data removal)
  const handleLogout = () => {
    navigate("/login");
  };

  return (

    <div className="min-h-screen flex flex-col bg-background">

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">

        <div className="container flex h-16 items-center justify-between">

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>

            <span className="font-display text-lg font-bold text-foreground">
              ClaimAssist
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}

            {/* Logout */}
            {currentUser && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-100"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            )}

          </nav>

        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex overflow-x-auto border-t border-border px-2 py-1.5 gap-1">

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}

        </nav>

      </header>

      {/* Page Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        <p>Smart ClaimAssist — Academic Minor Project © 2026</p>
      </footer>

    </div>

  );
};

export default AppLayout;