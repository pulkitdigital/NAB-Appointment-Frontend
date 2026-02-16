// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { format, addMinutes, isBefore, isAfter, parseISO } from 'date-fns';
// import toast from 'react-hot-toast';
// import { getAllAppointments, getCAList } from '../../services/api';

// const Appointments = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [filteredAppointments, setFilteredAppointments] = useState([]);
//   const [caList, setCAList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     status: '',
//     date: '',
//     search: '',
//     ca_id: '',
//   });
//   const [selectedAppointment, setSelectedAppointment] = useState(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);

//   useEffect(() => {
//     fetchCAList();
//     fetchAppointments();
//     // Auto-refresh every minute to update statuses
//     const interval = setInterval(() => {
//       updateAppointmentStatuses();
//     }, 60000);
//     return () => clearInterval(interval);
//   }, []);

//   // Apply filters whenever appointments or filters change
//   useEffect(() => {
//     applyFilters();
//   }, [appointments, filters]);

//   const fetchCAList = async () => {
//     try {
//       const response = await getCAList();
//       if (response.success) {
//         const caData = response.data.cas || response.data || [];
//         setCAList(caData);
//       }
//     } catch (error) {
//       console.error('Failed to fetch CA list:', error);
//     }
//   };

//   const fetchAppointments = async () => {
//     setLoading(true);
//     try {
//       // Fetch all appointments without filters (we'll filter on frontend)
//       const response = await getAllAppointments({});
      
//       if (response.success) {
//         const appointmentsData = response.data.appointments || [];
        
//         // Calculate automatic statuses based on time
//         const appointmentsWithStatus = appointmentsData.map(apt => ({
//           ...apt,
//           status: calculateStatus(apt)
//         }));
        
//         setAppointments(appointmentsWithStatus);
//       } else {
//         toast.error(response.message || 'Failed to fetch appointments');
//       }
//     } catch (error) {
//       toast.error('Failed to fetch appointments');
//       console.error('Fetch error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const applyFilters = () => {
//     let filtered = [...appointments];

//     // Search filter (name, email, phone, reference ID)
//     if (filters.search) {
//       const searchLower = filters.search.toLowerCase();
//       filtered = filtered.filter(apt => 
//         (apt.customer_name?.toLowerCase().includes(searchLower)) ||
//         (apt.customer_email?.toLowerCase().includes(searchLower)) ||
//         (apt.customer_phone?.includes(searchLower)) ||
//         (apt.id?.toLowerCase().includes(searchLower))
//       );
//     }

//     // Status filter
//     if (filters.status) {
//       filtered = filtered.filter(apt => apt.status === filters.status);
//     }

//     // Date filter
//     if (filters.date) {
//       filtered = filtered.filter(apt => apt.date === filters.date);
//     }

//     // CA filter
//     if (filters.ca_id) {
//       filtered = filtered.filter(apt => apt.assigned_ca === filters.ca_id);
//     }

//     setFilteredAppointments(filtered);
//   };

//   const calculateStatus = (appointment) => {
//     // If manually cancelled, keep it cancelled
//     if (appointment.status === 'cancelled') {
//       return 'cancelled';
//     }

//     try {
//       const appointmentDate = parseISO(appointment.date);
//       const [hours, minutes] = appointment.time_slot.split(':');
//       const appointmentStartTime = new Date(appointmentDate);
//       appointmentStartTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
//       const appointmentEndTime = addMinutes(appointmentStartTime, appointment.duration || 30);
//       const now = new Date();

//       // If current time is after appointment end time, mark as completed
//       if (isAfter(now, appointmentEndTime)) {
//         return 'completed';
//       }
      
//       // If current time is between start and end time, mark as confirmed (ongoing)
//       if (isAfter(now, appointmentStartTime) && isBefore(now, appointmentEndTime)) {
//         return 'confirmed';
//       }
      
//       // If appointment is in the future, mark as pending
//       return 'pending';
//     } catch (error) {
//       console.error('Error calculating status:', error);
//       return appointment.status || 'pending';
//     }
//   };

//   const updateAppointmentStatuses = () => {
//     setAppointments(prevAppointments => 
//       prevAppointments.map(apt => ({
//         ...apt,
//         status: calculateStatus(apt)
//       }))
//     );
//   };

//   const viewDetails = (appointment) => {
//     setSelectedAppointment(appointment);
//     setShowDetailsModal(true);
//   };

//   const clearFilters = () => {
//     setFilters({
//       status: '',
//       date: '',
//       search: '',
//       ca_id: '',
//     });
//   };

//   const StatusBadge = ({ status }) => {
//     const colors = {
//       pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
//       confirmed: 'bg-green-100 text-green-800 border-green-200',
//       completed: 'bg-blue-100 text-blue-800 border-blue-200',
//       cancelled: 'bg-red-100 text-red-800 border-red-200',
//     };

//     const labels = {
//       pending: 'Pending',
//       confirmed: 'Ongoing',
//       completed: 'Completed',
//       cancelled: 'Cancelled',
//     };

//     return (
//       <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
//         {labels[status] || status}
//       </span>
//     );
//   };

//   // Check if any filters are active
//   const hasActiveFilters = filters.status || filters.date || filters.search || filters.ca_id;

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-800 mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading appointments...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto space-y-6 pb-8">
        
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
//         >
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-gray-900 rounded-xl">
//                 <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                 </svg>
//               </div>
//               <div>
//                 <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Appointments</h1>
//                 <p className="text-gray-600 text-sm md:text-base mt-1">Manage all consultation bookings</p>
//               </div>
//             </div>
//             {hasActiveFilters && (
//               <button
//                 onClick={clearFilters}
//                 className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 whitespace-nowrap"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//                 Clear Filters
//               </button>
//             )}
//           </div>
//         </motion.div>

//         {/* Filters Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//             {/* Search */}
//             <div className="lg:col-span-2">
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Search
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                   </svg>
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Name, email, phone, or reference ID..."
//                   value={filters.search}
//                   onChange={(e) => setFilters({ ...filters, search: e.target.value })}
//                   className="w-full pl-10 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
//                 />
//               </div>
//             </div>
            
//             {/* Status Filter */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Status
//               </label>
//               <select
//                 value={filters.status}
//                 onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
//               >
//                 <option value="">All Statuses</option>
//                 <option value="pending">Pending</option>
//                 <option value="confirmed">Ongoing</option>
//                 <option value="completed">Completed</option>
//                 <option value="cancelled">Cancelled</option>
//               </select>
//             </div>

//             {/* CA Filter */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Chartered Accountant
//               </label>
//               <select
//                 value={filters.ca_id}
//                 onChange={(e) => setFilters({ ...filters, ca_id: e.target.value })}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
//               >
//                 <option value="">All CAs</option>
//                 {caList.map((ca) => (
//                   <option key={ca.id} value={ca.id}>
//                     {ca.name}
//                   </option>
//                 ))}
//                 <option value="unassigned">Unassigned</option>
//               </select>
//             </div>

//             {/* Date Filter */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Date
//               </label>
//               <input
//                 type="date"
//                 value={filters.date}
//                 onChange={(e) => setFilters({ ...filters, date: e.target.value })}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
//               />
//             </div>
//           </div>

//           {/* Active Filters Display */}
//           {hasActiveFilters && (
//             <div className="mt-4 flex flex-wrap items-center gap-2">
//               <span className="text-sm font-semibold text-gray-700">Active Filters:</span>
//               {filters.search && (
//                 <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-xs font-semibold border border-gray-200">
//                   Search: {filters.search}
//                   <button
//                     onClick={() => setFilters({ ...filters, search: '' })}
//                     className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
//                   >
//                     <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                     </svg>
//                   </button>
//                 </span>
//               )}
//               {filters.status && (
//                 <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-xs font-semibold border border-gray-200">
//                   Status: {filters.status}
//                   <button
//                     onClick={() => setFilters({ ...filters, status: '' })}
//                     className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
//                   >
//                     <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                     </svg>
//                   </button>
//                 </span>
//               )}
//               {filters.ca_id && (
//                 <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-xs font-semibold border border-gray-200">
//                   CA: {filters.ca_id === 'unassigned' ? 'Unassigned' : caList.find(ca => ca.id === filters.ca_id)?.name || filters.ca_id}
//                   <button
//                     onClick={() => setFilters({ ...filters, ca_id: '' })}
//                     className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
//                   >
//                     <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                     </svg>
//                   </button>
//                 </span>
//               )}
//               {filters.date && (
//                 <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-xs font-semibold border border-gray-200">
//                   Date: {format(new Date(filters.date), 'MMM d, yyyy')}
//                   <button
//                     onClick={() => setFilters({ ...filters, date: '' })}
//                     className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
//                   >
//                     <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                     </svg>
//                   </button>
//                 </span>
//               )}
//             </div>
//           )}
//         </motion.div>

//         {/* Results */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
//         >
//           {/* Results Count */}
//           <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//             <p className="text-sm text-gray-600">
//               Showing <span className="font-bold text-gray-900">{filteredAppointments.length}</span> of <span className="font-bold text-gray-900">{appointments.length}</span> appointments
//             </p>
//           </div>

//           {filteredAppointments.length === 0 ? (
//             <div className="text-center py-12 text-gray-500 px-6">
//               <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//               </svg>
//               <p className="font-bold text-lg text-gray-900">No appointments found</p>
//               {hasActiveFilters ? (
//                 <div>
//                   <p className="text-sm mt-2">No results match your current filters</p>
//                   <button
//                     onClick={clearFilters}
//                     className="mt-4 px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold"
//                   >
//                     Clear All Filters
//                   </button>
//                 </div>
//               ) : (
//                 <p className="text-sm mt-2">No appointments have been booked yet</p>
//               )}
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gray-50 border-b border-gray-200">
//                     <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase">Reference ID</th>
//                     <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase">Client</th>
//                     <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase">Date & Time</th>
//                     <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase">Duration</th>
//                     <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase">Assigned CA</th>
//                     <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase">Status</th>
//                     <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase">Amount</th>
//                     <th className="text-center py-3 px-4 text-xs font-bold text-gray-700 uppercase">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredAppointments.map((appointment) => (
//                     <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
//                       <td className="py-3 px-4">
//                         <span className="font-mono text-sm font-bold text-gray-900">
//                           {appointment.id || 'N/A'}
//                         </span>
//                       </td>
//                       <td className="py-3 px-4">
//                         <div>
//                           <p className="font-semibold text-sm text-gray-900">{appointment.customer_name || 'N/A'}</p>
//                           <p className="text-xs text-gray-600">{appointment.customer_phone || 'N/A'}</p>
//                           <p className="text-xs text-gray-600">{appointment.customer_email || 'N/A'}</p>
//                         </div>
//                       </td>
//                       <td className="py-3 px-4 text-sm">
//                         <div>
//                           <p className="font-semibold text-gray-900">
//                             {appointment.date ? format(new Date(appointment.date), 'MMM d, yyyy') : 'N/A'}
//                           </p>
//                           <p className="text-gray-600 text-xs">{appointment.time_slot || 'N/A'}</p>
//                         </div>
//                       </td>
//                       <td className="py-3 px-4 text-sm text-gray-700">
//                         {appointment.duration || 30} min
//                       </td>
//                       <td className="py-3 px-4 text-sm">
//                         {appointment.ca_details ? (
//                           <div>
//                             <p className="font-semibold text-gray-900">{appointment.ca_details.name}</p>
//                             <p className="text-xs text-gray-500">{appointment.ca_details.email}</p>
//                           </div>
//                         ) : (
//                           <span className="text-gray-400 italic text-xs">Not Assigned</span>
//                         )}
//                       </td>
//                       <td className="py-3 px-4">
//                         <StatusBadge status={appointment.status || 'pending'} />
//                       </td>
//                       <td className="py-3 px-4 text-sm font-bold text-gray-900">
//                         ₹{appointment.amount || 0}
//                       </td>
//                       <td className="py-3 px-4">
//                         <div className="flex items-center justify-center">
//                           <button
//                             onClick={() => viewDetails(appointment)}
//                             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                             title="View Details"
//                           >
//                             <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                             </svg>
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </motion.div>

//         {/* Details Modal */}
//         {showDetailsModal && selectedAppointment && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
//             >
//               <div className="border-b border-gray-200 p-6 flex items-center justify-between">
//                 <h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
//                 <button
//                   onClick={() => setShowDetailsModal(false)}
//                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
//                 >
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>

//               <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
//                 <div>
//                   <h3 className="text-lg font-bold text-gray-900 mb-3">Client Information</h3>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex">
//                       <span className="w-40 text-gray-600 font-medium">Reference ID:</span>
//                       <span className="font-mono font-bold text-gray-900">{selectedAppointment.id || 'N/A'}</span>
//                     </div>
//                     <div className="flex">
//                       <span className="w-40 text-gray-600 font-medium">Name:</span>
//                       <span className="font-semibold text-gray-900">{selectedAppointment.customer_name || 'N/A'}</span>
//                     </div>
//                     <div className="flex">
//                       <span className="w-40 text-gray-600 font-medium">Mobile:</span>
//                       <span className="text-gray-700">{selectedAppointment.customer_phone || 'N/A'}</span>
//                     </div>
//                     <div className="flex">
//                       <span className="w-40 text-gray-600 font-medium">Email:</span>
//                       <span className="text-gray-700">{selectedAppointment.customer_email || 'N/A'}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="text-lg font-bold text-gray-900 mb-3">Appointment Details</h3>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex">
//                       <span className="w-40 text-gray-600 font-medium">Date:</span>
//                       <span className="font-semibold text-gray-900">
//                         {selectedAppointment.date ? format(new Date(selectedAppointment.date), 'EEEE, MMMM d, yyyy') : 'N/A'}
//                       </span>
//                     </div>
//                     <div className="flex">
//                       <span className="w-40 text-gray-600 font-medium">Time:</span>
//                       <span className="font-semibold text-gray-900">{selectedAppointment.time_slot || 'N/A'}</span>
//                     </div>
//                     <div className="flex">
//                       <span className="w-40 text-gray-600 font-medium">Duration:</span>
//                       <span className="font-semibold text-gray-900">{selectedAppointment.duration || 30} minutes</span>
//                     </div>
//                     <div className="flex">
//                       <span className="w-40 text-gray-600 font-medium">Status:</span>
//                       <StatusBadge status={selectedAppointment.status || 'pending'} />
//                     </div>
//                     <div className="flex">
//                       <span className="w-40 text-gray-600 font-medium">Amount Paid:</span>
//                       <span className="font-bold text-gray-900">₹{selectedAppointment.amount || 0}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="text-lg font-bold text-gray-900 mb-3">Chartered Accountant</h3>
//                   <div className="space-y-2 text-sm">
//                     {selectedAppointment.ca_details ? (
//                       <>
//                         <div className="flex">
//                           <span className="w-40 text-gray-600 font-medium">Name:</span>
//                           <span className="font-semibold text-gray-900">{selectedAppointment.ca_details.name}</span>
//                         </div>
//                         <div className="flex">
//                           <span className="w-40 text-gray-600 font-medium">Email:</span>
//                           <span className="text-gray-700">{selectedAppointment.ca_details.email}</span>
//                         </div>
//                         {selectedAppointment.ca_details.phone && (
//                           <div className="flex">
//                             <span className="w-40 text-gray-600 font-medium">Phone:</span>
//                             <span className="text-gray-700">{selectedAppointment.ca_details.phone}</span>
//                           </div>
//                         )}
//                         {selectedAppointment.ca_details.specialization && (
//                           <div className="flex">
//                             <span className="w-40 text-gray-600 font-medium">Specialization:</span>
//                             <span className="text-gray-700">{selectedAppointment.ca_details.specialization}</span>
//                           </div>
//                         )}
//                         {selectedAppointment.ca_details.experience && (
//                           <div className="flex">
//                             <span className="w-40 text-gray-600 font-medium">Experience:</span>
//                             <span className="text-gray-700">{selectedAppointment.ca_details.experience} years</span>
//                           </div>
//                         )}
//                       </>
//                     ) : (
//                       <div className="flex">
//                         <span className="w-40 text-gray-600 font-medium">Assigned CA:</span>
//                         <span className="text-gray-400 italic">Not Assigned</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {selectedAppointment.consult_note && (
//                   <div>
//                     <h3 className="text-lg font-bold text-gray-900 mb-3">Consultation Notes</h3>
//                     <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
//                       {selectedAppointment.consult_note}
//                     </p>
//                   </div>
//                 )}

//                 <div>
//                   <h3 className="text-lg font-bold text-gray-900 mb-3">Payment Information</h3>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex">
//                       <span className="w-40 text-gray-600 font-medium">Payment ID:</span>
//                       <span className="font-mono text-xs text-gray-700">{selectedAppointment.payment_id || 'N/A'}</span>
//                     </div>
//                     <div className="flex">
//                       <span className="w-40 text-gray-600 font-medium">Order ID:</span>
//                       <span className="font-mono text-xs text-gray-700">{selectedAppointment.order_id || 'N/A'}</span>
//                     </div>
//                     <div className="flex">
//                       <span className="w-40 text-gray-600 font-medium">Payment Status:</span>
//                       <span className="font-semibold text-green-700">{selectedAppointment.payment_status || 'Completed'}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-6 border-t border-gray-200 bg-gray-50">
//                 <button
//                   onClick={() => setShowDetailsModal(false)}
//                   className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
//                 >
//                   Close
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Appointments;
























import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, addMinutes, isBefore, isAfter, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import { getAllAppointments, getCAList } from '../../services/api';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [caList, setCAList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    date: '',
    search: '',
    ca_id: '',
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchCAList();
    fetchAppointments();
    // Auto-refresh every minute to update statuses
    const interval = setInterval(() => {
      updateAppointmentStatuses();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Apply filters whenever appointments or filters change
  useEffect(() => {
    applyFilters();
  }, [appointments, filters]);

  const fetchCAList = async () => {
    try {
      const response = await getCAList();
      if (response.success) {
        const caData = response.data.cas || response.data || [];
        setCAList(caData);
      }
    } catch (error) {
      console.error('Failed to fetch CA list:', error);
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // Fetch all appointments without filters (we'll filter on frontend)
      const response = await getAllAppointments({});
      
      if (response.success) {
        const appointmentsData = response.data.appointments || [];
        
        // Calculate automatic statuses based on time
        const appointmentsWithStatus = appointmentsData.map(apt => ({
          ...apt,
          status: calculateStatus(apt)
        }));
        
        setAppointments(appointmentsWithStatus);
      } else {
        toast.error(response.message || 'Failed to fetch appointments');
      }
    } catch (error) {
      toast.error('Failed to fetch appointments');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...appointments];

    // Search filter (name, email, phone, reference ID)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(apt => 
        (apt.customer_name?.toLowerCase().includes(searchLower)) ||
        (apt.customer_email?.toLowerCase().includes(searchLower)) ||
        (apt.customer_phone?.includes(searchLower)) ||
        (apt.id?.toLowerCase().includes(searchLower))
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(apt => apt.status === filters.status);
    }

    // Date filter
    if (filters.date) {
      filtered = filtered.filter(apt => apt.date === filters.date);
    }

    // CA filter
    if (filters.ca_id) {
      filtered = filtered.filter(apt => apt.assigned_ca === filters.ca_id);
    }

    setFilteredAppointments(filtered);
  };

  const calculateStatus = (appointment) => {
    // If manually cancelled, keep it cancelled
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

      // If current time is after appointment end time, mark as completed
      if (isAfter(now, appointmentEndTime)) {
        return 'completed';
      }
      
      // If current time is between start and end time, mark as confirmed (ongoing)
      if (isAfter(now, appointmentStartTime) && isBefore(now, appointmentEndTime)) {
        return 'confirmed';
      }
      
      // If appointment is in the future, mark as pending
      return 'pending';
    } catch (error) {
      console.error('Error calculating status:', error);
      return appointment.status || 'pending';
    }
  };

  const updateAppointmentStatuses = () => {
    setAppointments(prevAppointments => 
      prevAppointments.map(apt => ({
        ...apt,
        status: calculateStatus(apt)
      }))
    );
  };

  const viewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      date: '',
      search: '',
      ca_id: '',
    });
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };

    const labels = {
      pending: 'Pending',
      confirmed: 'Ongoing',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };

    return (
      <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border ${colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {labels[status] || status}
      </span>
    );
  };

  // Check if any filters are active
  const hasActiveFilters = filters.status || filters.date || filters.search || filters.ca_id;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-gray-200 border-t-gray-800 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-sm sm:text-base">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 px-3 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 pb-6 sm:pb-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gray-900 rounded-lg sm:rounded-xl">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Appointments</h1>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base mt-0.5 sm:mt-1">Manage all consultation bookings</p>
              </div>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            )}
          </div>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* Search */}
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Name, email, phone, or ID..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-9 sm:pl-10 px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* CA Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Chartered Accountant
              </label>
              <select
                value={filters.ca_id}
                onChange={(e) => setFilters({ ...filters, ca_id: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
              >
                <option value="">All CAs</option>
                {caList.map((ca) => (
                  <option key={ca.id} value={ca.id}>
                    {ca.name}
                  </option>
                ))}
                <option value="unassigned">Unassigned</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold text-gray-700">Active Filters:</span>
              {filters.search && (
                <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gray-100 text-gray-800 rounded-lg text-xs font-semibold border border-gray-200">
                  Search: {filters.search.length > 15 ? filters.search.substring(0, 15) + '...' : filters.search}
                  <button
                    onClick={() => setFilters({ ...filters, search: '' })}
                    className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
              {filters.status && (
                <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gray-100 text-gray-800 rounded-lg text-xs font-semibold border border-gray-200">
                  Status: {filters.status}
                  <button
                    onClick={() => setFilters({ ...filters, status: '' })}
                    className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
              {filters.ca_id && (
                <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gray-100 text-gray-800 rounded-lg text-xs font-semibold border border-gray-200">
                  CA: {filters.ca_id === 'unassigned' ? 'Unassigned' : caList.find(ca => ca.id === filters.ca_id)?.name || filters.ca_id}
                  <button
                    onClick={() => setFilters({ ...filters, ca_id: '' })}
                    className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
              {filters.date && (
                <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gray-100 text-gray-800 rounded-lg text-xs font-semibold border border-gray-200">
                  Date: {format(new Date(filters.date), 'MMM d, yyyy')}
                  <button
                    onClick={() => setFilters({ ...filters, date: '' })}
                    className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
            </div>
          )}
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Results Count */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
            <p className="text-xs sm:text-sm text-gray-600">
              Showing <span className="font-bold text-gray-900">{filteredAppointments.length}</span> of <span className="font-bold text-gray-900">{appointments.length}</span> appointments
            </p>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-gray-500 px-4 sm:px-6">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="font-bold text-base sm:text-lg text-gray-900">No appointments found</p>
              {hasActiveFilters ? (
                <div>
                  <p className="text-xs sm:text-sm mt-2">No results match your current filters</p>
                  <button
                    onClick={clearFilters}
                    className="mt-3 sm:mt-4 px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-xs sm:text-sm font-semibold"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <p className="text-xs sm:text-sm mt-2">No appointments have been booked yet</p>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table View - Hidden on mobile */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase">Reference ID</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase">Client</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase">Date & Time</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase">Duration</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase">Assigned CA</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase">Status</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase">Amount</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((appointment) => (
                      <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono text-sm font-bold text-gray-900">
                            {appointment.id || 'N/A'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-semibold text-sm text-gray-900">{appointment.customer_name || 'N/A'}</p>
                            <p className="text-xs text-gray-600">{appointment.customer_phone || 'N/A'}</p>
                            <p className="text-xs text-gray-600">{appointment.customer_email || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {appointment.date ? format(new Date(appointment.date), 'MMM d, yyyy') : 'N/A'}
                            </p>
                            <p className="text-gray-600 text-xs">{appointment.time_slot || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {appointment.duration || 30} min
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {appointment.ca_details ? (
                            <div>
                              <p className="font-semibold text-gray-900">{appointment.ca_details.name}</p>
                              <p className="text-xs text-gray-500">{appointment.ca_details.email}</p>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic text-xs">Not Assigned</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={appointment.status || 'pending'} />
                        </td>
                        <td className="py-3 px-4 text-sm font-bold text-gray-900">
                          ₹{appointment.amount || 0}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => viewDetails(appointment)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="lg:hidden divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 sm:p-5 hover:bg-gray-50 transition-colors"
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm sm:text-base text-gray-900 truncate">
                          {appointment.customer_name || 'N/A'}
                        </p>
                        <p className="font-mono text-xs text-gray-600 mt-0.5">
                          ID: {appointment.id || 'N/A'}
                        </p>
                      </div>
                      <StatusBadge status={appointment.status || 'pending'} />
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-1 mb-3">
                      <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {appointment.customer_phone || 'N/A'}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1.5 truncate">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate">{appointment.customer_email || 'N/A'}</span>
                      </p>
                    </div>

                    {/* Appointment Details */}
                    <div className="grid grid-cols-2 gap-3 mb-3 text-xs sm:text-sm">
                      <div>
                        <p className="text-gray-500 font-medium mb-0.5">Date & Time</p>
                        <p className="font-semibold text-gray-900">
                          {appointment.date ? format(new Date(appointment.date), 'MMM d, yyyy') : 'N/A'}
                        </p>
                        <p className="text-gray-600">{appointment.time_slot || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium mb-0.5">Duration & Amount</p>
                        <p className="font-semibold text-gray-900">{appointment.duration || 30} min</p>
                        <p className="font-bold text-gray-900">₹{appointment.amount || 0}</p>
                      </div>
                    </div>

                    {/* CA Info */}
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 font-medium mb-1">Assigned CA</p>
                      {appointment.ca_details ? (
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{appointment.ca_details.name}</p>
                          <p className="text-xs text-gray-500">{appointment.ca_details.email}</p>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">Not Assigned</p>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => viewDetails(appointment)}
                      className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>

        {/* Details Modal */}
        {showDetailsModal && selectedAppointment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between flex-shrink-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Appointment Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto flex-1">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Client Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex flex-col sm:flex-row">
                      <span className="sm:w-40 text-gray-600 font-medium mb-0.5 sm:mb-0">Reference ID:</span>
                      <span className="font-mono font-bold text-gray-900 break-all">{selectedAppointment.id || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                      <span className="sm:w-40 text-gray-600 font-medium mb-0.5 sm:mb-0">Name:</span>
                      <span className="font-semibold text-gray-900">{selectedAppointment.customer_name || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                      <span className="sm:w-40 text-gray-600 font-medium mb-0.5 sm:mb-0">Mobile:</span>
                      <span className="text-gray-700">{selectedAppointment.customer_phone || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                      <span className="sm:w-40 text-gray-600 font-medium mb-0.5 sm:mb-0">Email:</span>
                      <span className="text-gray-700 break-all">{selectedAppointment.customer_email || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Appointment Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex flex-col sm:flex-row">
                      <span className="sm:w-40 text-gray-600 font-medium mb-0.5 sm:mb-0">Date:</span>
                      <span className="font-semibold text-gray-900">
                        {selectedAppointment.date ? format(new Date(selectedAppointment.date), 'EEEE, MMMM d, yyyy') : 'N/A'}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                      <span className="sm:w-40 text-gray-600 font-medium mb-0.5 sm:mb-0">Time:</span>
                      <span className="font-semibold text-gray-900">{selectedAppointment.time_slot || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                      <span className="sm:w-40 text-gray-600 font-medium mb-0.5 sm:mb-0">Duration:</span>
                      <span className="font-semibold text-gray-900">{selectedAppointment.duration || 30} minutes</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="sm:w-40 text-gray-600 font-medium mb-1 sm:mb-0">Status:</span>
                      <StatusBadge status={selectedAppointment.status || 'pending'} />
                    </div>
                    <div className="flex flex-col sm:flex-row">
                      <span className="sm:w-40 text-gray-600 font-medium mb-0.5 sm:mb-0">Amount Paid:</span>
                      <span className="font-bold text-gray-900">₹{selectedAppointment.amount || 0}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Chartered Accountant</h3>
                  <div className="space-y-2 text-sm">
                    {selectedAppointment.ca_details ? (
                      <>
                        <div className="flex flex-col sm:flex-row">
                          <span className="sm:w-40 text-gray-600 font-medium mb-0.5 sm:mb-0">Name:</span>
                          <span className="font-semibold text-gray-900">{selectedAppointment.ca_details.name}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row">
                          <span className="sm:w-40 text-gray-600 font-medium mb-0.5 sm:mb-0">Email:</span>
                          <span className="text-gray-700 break-all">{selectedAppointment.ca_details.email}</span>
                        </div>
                        {selectedAppointment.ca_details.phone && (
                          <div className="flex flex-col sm:flex-row">
                            <span className="sm:w-40 text-gray-600 font-medium mb-0.5 sm:mb-0">Phone:</span>
                            <span className="text-gray-700">{selectedAppointment.ca_details.phone}</span>
                          </div>
                        )}
                        {selectedAppointment.ca_details.specialization && (
                          <div className="flex flex-col sm:flex-row">
                            <span className="sm:w-40 text-gray-600 font-medium mb-0.5 sm:mb-0">Specialization:</span>
                            <span className="text-gray-700">{selectedAppointment.ca_details.specialization}</span>
                          </div>
                        )}
                        {selectedAppointment.ca_details.experience && (
                          <div className="flex flex-col sm:flex-row">
                            <span className="sm:w-40 text-gray-600 font-medium mb-0.5 sm:mb-0">Experience:</span>
                            <span className="text-gray-700">{selectedAppointment.ca_details.experience} years</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col sm:flex-row">
                        <span className="sm:w-40 text-gray-600 font-medium mb-0.5 sm:mb-0">Assigned CA:</span>
                        <span className="text-gray-400 italic">Not Assigned</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedAppointment.consult_note && (
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Consultation Notes</h3>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                      {selectedAppointment.consult_note}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Payment Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex flex-col sm:flex-row">
                      <span className="sm:w-40 text-gray-600 font-medium mb-0.5 sm:mb-0">Payment ID:</span>
                      <span className="font-mono text-xs text-gray-700 break-all">{selectedAppointment.payment_id || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                      <span className="sm:w-40 text-gray-600 font-medium mb-0.5 sm:mb-0">Order ID:</span>
                      <span className="font-mono text-xs text-gray-700 break-all">{selectedAppointment.order_id || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                      <span className="sm:w-40 text-gray-600 font-medium mb-0.5 sm:mb-0">Payment Status:</span>
                      <span className="font-semibold text-green-700">{selectedAppointment.payment_status || 'Completed'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-full px-6 py-2.5 sm:py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;