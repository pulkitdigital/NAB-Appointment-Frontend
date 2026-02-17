import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { setBusinessId } from './services/api';
import { useEffect } from 'react';

// ✅ Auth
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import UserLayout from './components/UserLayout';
import AdminLayout from './components/AdminLayout';

// User Pages
import Book from './pages/Book';
import Confirmation from './pages/Confirmation';
import CAListingSimple from './pages/Calistingsimple';
import CAListing from './pages/CAListing';

// Admin Pages
import AdminLogin from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import Appointments from './pages/admin/Appointments';
import CA from './pages/admin/CA';
import Settings from './pages/admin/Settings';
import { startKeepAlive } from './services/api';
function App() {
  useEffect(() => {
    // ✅ Set default business ID on app load
    const businessId = import.meta.env.VITE_BUSINESS_ID || 'nab-consultancy';
    const businessName = 'NAB Consultancy Appointment';
    
    setBusinessId(businessId, businessName);
  }, []);

  useEffect(() => {
    const interval = startKeepAlive(); // Frontend khulte hi backend jagao
    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    // ✅ AuthProvider wraps entire app
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        
        <Routes>
          {/* User Routes - Wrapped with Header & Footer */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<Navigate to="/book" replace />} />
            <Route path="/appointment" element={<Book />} />
            <Route path="/book" element={<Book />} />
            <Route path="/confirmation/:bookingId" element={<Confirmation />} />
            <Route path="/cas" element={<CAListingSimple />} />
            <Route path="/ca-listing" element={<CAListing />} />
          </Route>

          {/* ✅ Admin Login - PUBLIC */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ✅ Admin Routes - PROTECTED (only logged in admin) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="ca" element={<CA />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/book" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;