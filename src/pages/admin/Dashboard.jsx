import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats, getAllAppointments } from '../../services/api';
import { format, addMinutes, isBefore, isAfter, parseISO } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    totalRevenue: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const calculateStatus = (appointment) => {
    if (appointment.status === 'cancelled') {
      return 'cancelled';
    }

    try {
      const appointmentDate = parseISO(appointment.date);
      const [hours, minutes] = appointment.time_slot.split(':');
      const appointmentStartTime = new Date(appointmentDate);
      appointmentStartTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const appointmentEndTime = addMinutes(appointmentStartTime, appointment.duration || 30);
      const now = new Date();

      if (isAfter(now, appointmentEndTime)) {
        return 'completed';
      }
      
      if (isAfter(now, appointmentStartTime) && isBefore(now, appointmentEndTime)) {
        return 'confirmed';
      }
      
      return 'pending';
    } catch (error) {
      console.error('Error calculating status:', error);
      return appointment.status || 'pending';
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📊 Fetching dashboard data');

      const [statsData, appointmentsData] = await Promise.all([
        getDashboardStats().catch(err => {
          console.error('Stats API failed:', err);
          return { success: false, data: {} };
        }),
        getAllAppointments({ 
          limit: 5, 
          sort: '-created_at'
        }).catch(err => {
          console.error('Appointments API failed:', err);
          return { success: false, data: { appointments: [] } };
        }),
      ]);

      console.log('📊 Stats response:', statsData);
      console.log('📋 Appointments response:', appointmentsData);

      if (statsData.success) {
        setStats(statsData.data);
      }

      if (appointmentsData.success) {
        const appointments = appointmentsData.data.appointments || appointmentsData.data || [];
        
        const appointmentsWithStatus = appointments.map(apt => ({
          ...apt,
          status: calculateStatus(apt)
        }));
        
        console.log('✅ Appointments loaded:', appointmentsWithStatus.length);
        console.log('👤 First appointment CA details:', appointmentsWithStatus[0]?.ca_details);
        setRecentAppointments(appointmentsWithStatus);
      }
    } catch (error) {
      console.error('❌ Failed to fetch dashboard data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      confirmed: { label: 'Ongoing', color: 'bg-green-100 text-green-800 border-green-200' },
      completed: { label: 'Completed', color: 'bg-blue-100 text-blue-800 border-blue-200' },
      cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200' },
      draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    };

    const config = statusConfig[status] || { label: status || 'Unknown', color: 'bg-gray-100 text-gray-800 border-gray-200' };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-800 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-900 font-bold text-lg mb-2">Failed to load dashboard</p>
          <p className="text-gray-600 text-sm mb-6">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 pb-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-900 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Overview of your appointment system</p>
              </div>
            </div>
            <button 
              onClick={fetchDashboardData}
              className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 font-semibold text-gray-700 whitespace-nowrap transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Appointments"
            value={stats.totalAppointments || 0}
            color="bg-gray-100"
            icon={
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />

          <StatCard
            title="Today's Appointments"
            value={stats.todayAppointments || 0}
            color="bg-green-100"
            icon={
              <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />

          <StatCard
            title="Pending"
            value={stats.pendingAppointments || 0}
            color="bg-yellow-100"
            icon={
              <svg className="w-6 h-6 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />

          <StatCard
            title="Total Revenue"
            value={`₹${(stats.totalRevenue || 0).toLocaleString()}`}
            color="bg-blue-100"
            icon={
              <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Recent Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Appointments</h2>
            <button 
              onClick={() => navigate('/admin/appointments')}
              className="text-sm text-gray-700 hover:text-gray-900 font-semibold transition-colors flex items-center gap-1"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {recentAppointments.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-900 font-bold mb-1">No appointments yet</p>
              <p className="text-gray-500 text-sm">Your recent appointments will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase">Reference ID</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase">Customer</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase">Date & Time</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase">Duration</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase">Assigned CA</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAppointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm font-mono font-bold text-gray-900">
                        {appointment.id || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div className="font-semibold text-gray-900">{appointment.customer_name || 'N/A'}</div>
                        <div className="text-xs text-gray-600">{appointment.customer_email || ''}</div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div className="font-semibold text-gray-900">
                          {appointment.date ? format(new Date(appointment.date), 'MMM d, yyyy') : 'N/A'}
                        </div>
                        <div className="text-xs text-gray-600">{appointment.time_slot || 'N/A'}</div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {appointment.duration ? `${appointment.duration} min` : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {appointment.ca_details ? (
                          <div>
                            <div className="font-semibold text-gray-900">{appointment.ca_details.name}</div>
                            <div className="text-xs text-gray-600">{appointment.ca_details.email}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-xs">Not Assigned</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={appointment.status} />
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-gray-900">
                        ₹{(appointment.amount || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;