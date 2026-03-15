import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Hospitals from "./pages/Hospitals";
import Campaign from "./pages/Campaign";

// User pages
import UserDashboard from "./pages/UserDashboard";
import DonateOrgan from "./pages/user/DonateOrgan";
import RequestOrgan from "./pages/user/RequestOrgan";
import MyDonations from "./pages/user/MyDonations";
import MyRequests from "./pages/user/MyRequests";
import UserProfile from "./pages/user/UserProfile";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AddDoctor from "./pages/admin/AddDoctor";
import ManageHospitals from "./pages/admin/ManageHospitals";
import ManageRequests from "./pages/admin/ManageRequests";
import ManageDonations from "./pages/admin/ManageDonations";

// Doctor pages
import DoctorDashboard from "./pages/DoctorDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/hospitals" element={<Hospitals />} />
            <Route path="/campaign" element={<Campaign />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/donate" element={
              <ProtectedRoute allowedRoles={['user']}>
                <DonateOrgan />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/request" element={
              <ProtectedRoute allowedRoles={['user']}>
                <RequestOrgan />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/my-donations" element={
              <ProtectedRoute allowedRoles={['user']}>
                <MyDonations />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/my-requests" element={
              <ProtectedRoute allowedRoles={['user']}>
                <MyRequests />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/profile" element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserProfile />
              </ProtectedRoute>
            } />

            {/* Admin routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/add-doctor" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AddDoctor />
              </ProtectedRoute>
            } />
            <Route path="/admin/hospitals" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageHospitals />
              </ProtectedRoute>
            } />
            <Route path="/admin/requests" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageRequests />
              </ProtectedRoute>
            } />
            <Route path="/admin/donations" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageDonations />
              </ProtectedRoute>
            } />

            {/* Doctor routes */}
            <Route path="/doctor" element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorDashboard />
              </ProtectedRoute>
            } />

            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
