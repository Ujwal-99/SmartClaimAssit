import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import UserProfilePage from "./pages/UserProfilePage";
import PlanRecommendationPage from "./pages/PlanRecommendationPage";
import PremiumCalculatorPage from "./pages/PremiumCalculatorPage";
import ClaimRiskPage from "./pages/ClaimRiskPage";
import PolicyComparisonPage from "./pages/PolicyComparisonPage";
import ChatbotPage from "./pages/ChatbotPage";

// Authentication Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

const queryClient = new QueryClient();


// 🔐 Protected Route
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {

  const user = localStorage.getItem("currentUser");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;

};


const App = () => (

  <QueryClientProvider client={queryClient}>

    <TooltipProvider>

      <Toaster />
      <Sonner />

      <BrowserRouter>

        <Routes>

          {/* Default Landing Page */}
          <Route path="/" element={<Navigate to="/register" replace />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          />

          {/* Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Recommendation */}
          <Route
            path="/recommend"
            element={
              <ProtectedRoute>
                <PlanRecommendationPage />
              </ProtectedRoute>
            }
          />

          {/* Premium Calculator */}
          <Route
            path="/premium"
            element={
              <ProtectedRoute>
                <PremiumCalculatorPage />
              </ProtectedRoute>
            }
          />

          {/* Claim Risk */}
          <Route
            path="/risk"
            element={
              <ProtectedRoute>
                <ClaimRiskPage />
              </ProtectedRoute>
            }
          />

          {/* Policy Comparison */}
          <Route
            path="/compare"
            element={
              <ProtectedRoute>
                <PolicyComparisonPage />
              </ProtectedRoute>
            }
          />

          {/* Chatbot */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatbotPage />
              </ProtectedRoute>
            }
          />

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />

        </Routes>

      </BrowserRouter>

    </TooltipProvider>

  </QueryClientProvider>

);

export default App;