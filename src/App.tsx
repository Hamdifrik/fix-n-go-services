import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ClientDashboard from "./pages/ClientDashboard";
import ClientProfile from "./pages/ClientProfile";
import HelperProfile from "./pages/HelperProfile";
import NewHelperDashboard from "./pages/NewHelperDashboard";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import BookService from "./pages/BookService";
import HelperCreateService from "./pages/HelperCreateService";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          
          {/* Client Routes */}
          <Route path="/dashboard" element={<ClientDashboard />} />
          <Route path="/profile" element={<ClientProfile />} />
          <Route path="/book/:serviceId" element={<BookService />} />
          
          {/* Helper Routes */}
          <Route path="/helper/dashboard" element={<NewHelperDashboard />} />
          <Route path="/helper/profile" element={<HelperProfile />} />
          <Route path="/helper/:id/profile" element={<HelperProfile />} />
          <Route path="/helper/services/new" element={<HelperCreateService />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;