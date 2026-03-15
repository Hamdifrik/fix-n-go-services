import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SocketProvider } from "@/contexts/SocketContext";
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
import HelperEditService from "./pages/HelperEditService";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import BookingDetail from "./pages/BookingDetail";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import HowItWorks from "./pages/HowItWorks";
import BecomeHelper from "./pages/BecomeHelper";
import Legal from "./pages/Legal";
import Cookies from "./pages/Cookies";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import CategoryServices from "./pages/CategoryServices";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SocketProvider>
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
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/helpers" element={<BecomeHelper />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/services/category/:category" element={<CategoryServices />} />
          
          {/* Client Routes */}
          <Route path="/dashboard" element={<ClientDashboard />} />
          <Route path="/profile" element={<ClientProfile />} />
          <Route path="/book/:serviceId" element={<BookService />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/bookings/:id" element={<BookingDetail />} />
          
          {/* Helper Routes */}
          <Route path="/helper/dashboard" element={<NewHelperDashboard />} />
          <Route path="/helper/profile" element={<HelperProfile />} />
          <Route path="/helper/:id/profile" element={<HelperProfile />} />
          <Route path="/helper/services/new" element={<HelperCreateService />} />
          <Route path="/helper/services/:id/edit" element={<HelperEditService />} />
          
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SocketProvider>
  </QueryClientProvider>
);

export default App;
