import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { setBusinessId } from './services/api';
import { useEffect } from 'react';
// User Pages
import Book from './pages/Book';
import Confirmation from './pages/Confirmation';

// Admin Pages
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Appointments from './pages/admin/Appointments';
import CA from './pages/admin/CA';
import Settings from './pages/admin/Settings';

function App() {
  useEffect(() => {
    // ✅ Set default business ID on app load
    const businessId = import.meta.env.VITE_BUSINESS_ID || 'nab-consultancy';
    const businessName = 'NAB Consultancy Appointment';
    
    setBusinessId(businessId, businessName);
  }, []);
  return (
    <Router>
      <Toaster position="top-right" />
      
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Navigate to="/book" replace />} />
        <Route path="/book" element={<Book />} />
        <Route path="/confirmation/:bookingId" element={<Confirmation />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="ca" element={<CA />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/book" replace />} />
      </Routes>
    </Router>
  );
}

export default App;