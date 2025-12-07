import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateMission from "./pages/CreateMission";
import ClientProfile from "./pages/ClientProfile";
import HelperProfile from "./pages/HelperProfile";
import HelperDashboard from "./pages/HelperDashboard";
import MissionDetail from "./pages/MissionDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mission/new" element={<CreateMission />} />
          <Route path="/mission/:id" element={<MissionDetail />} />
          <Route path="/profile" element={<ClientProfile />} />
          <Route path="/helper/dashboard" element={<HelperDashboard />} />
          <Route path="/helper/profile" element={<HelperProfile />} />
          <Route path="/helper/:id/profile" element={<HelperProfile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
