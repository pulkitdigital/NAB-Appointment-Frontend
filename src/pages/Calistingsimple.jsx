// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import toast from 'react-hot-toast';
// import { getCAList } from '../services/api';
// import { useNavigate } from 'react-router-dom';

// const CAListingSimple = () => {
//   const [caList, setCAList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCA, setSelectedCA] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchCAList();
//   }, []);

//   const fetchCAList = async () => {
//     setLoading(true);
//     try {
//       const response = await getCAList();
      
//       if (response.success) {
//         const caData = response.data.cas || response.data || [];
//         const activeCAs = caData.filter(ca => ca.status === 'active');
        
//         // 🔍 COMPREHENSIVE DEBUG
//         console.log('=== CA LISTING DEBUG ===');
//         console.log('Total Active CAs:', activeCAs.length);
//         if (activeCAs.length > 0) {
//           console.log('First CA Full Object:', activeCAs[0]);
//           console.log('First CA Keys:', Object.keys(activeCAs[0]));
//           console.log('ID Fields Check:');
//           console.log('  ca.id:', activeCAs[0].id);
//           console.log('  ca._id:', activeCAs[0]._id);
//           console.log('  ca.ca_id:', activeCAs[0].ca_id);
//           console.log('  ca.userId:', activeCAs[0].userId);
//           console.log('  ca.user_id:', activeCAs[0].user_id);
          
//           console.log('\nAll CA IDs:');
//           activeCAs.forEach((ca, index) => {
//             console.log(`  ${index + 1}. ${ca.name} - ID fields:`, {
//               id: ca.id,
//               _id: ca._id,
//               ca_id: ca.ca_id,
//               userId: ca.userId,
//               user_id: ca.user_id
//             });
//           });
//         }
//         console.log('========================');
        
//         setCAList(activeCAs);
//       } else {
//         toast.error('Failed to load professionals');
//         console.error('❌ API Response not successful:', response);
//       }
//     } catch (error) {
//       toast.error('Failed to load professionals');
//       console.error('❌ Error fetching CA list:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper to get CA ID
//   const getCAId = (ca) => {
//     const id = ca.id || ca._id || ca.ca_id || ca.userId || ca.user_id;
//     console.log(`Getting ID for ${ca.name}:`, id);
//     return id;
//   };

//   const handleBookAppointment = (ca) => {
//     const caId = getCAId(ca);
    
//     console.log('=== BOOKING APPOINTMENT ===');
//     console.log('Selected CA:', ca.name);
//     console.log('Full CA Object:', ca);
//     console.log('Extracted CA ID:', caId);
//     console.log('CA ID Type:', typeof caId);
    
//     if (!caId) {
//       console.error('❌ ERROR: No valid ID found!');
//       toast.error('Unable to book appointment - CA ID not found');
//       return;
//     }
    
//     // ✅ FIXED: Use /book instead of /appointment
//     const url = `/book?ca_id=${caId}`;
//     console.log('✅ Navigating to:', url);
//     console.log('===========================');
    
//     navigate(url);
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-900"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             Our Expert Chartered Accountants
//           </h1>
//           <p className="text-lg text-gray-600">
//             Professional CA services for all your financial needs
//           </p>
//         </div>

//         {/* CA Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {caList.map((ca) => {
//             const caId = getCAId(ca);
//             return (
//               <motion.div
//                 key={caId}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden"
//               >
//                 {/* Profile Picture */}
//                 <div className="h-48 bg-gray-900 flex items-center justify-center">
//                   {ca.profile_picture ? (
//                     <img 
//                       src={ca.profile_picture} 
//                       alt={ca.name}
//                       className="w-32 h-32 rounded-full object-cover border-4 border-white"
//                     />
//                   ) : (
//                     <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center">
//                       <span className="text-4xl font-bold text-gray-900">
//                         {ca.name.charAt(0).toUpperCase()}
//                       </span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Card Content */}
//                 <div className="p-6">
//                   <h3 className="text-xl font-bold text-gray-900 mb-1 text-center">
//                     {ca.name}
//                   </h3>
//                   {ca.qualification && (
//                     <p className="text-gray-600 text-center mb-4">
//                       {ca.qualification}
//                     </p>
//                   )}

//                   <div className="space-y-3 mb-4">
//                     <div className="flex items-center text-sm text-gray-700">
//                       <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                       </svg>
//                       <span>{ca.specialization}</span>
//                     </div>
//                     <div className="flex items-center text-sm text-gray-700">
//                       <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                       <span>{ca.experience || 0}+ years experience</span>
//                     </div>
//                   </div>

//                   {ca.intro && (
//                     <p className="text-sm text-gray-600 mb-4 line-clamp-2">
//                       {ca.intro}
//                     </p>
//                   )}

//                   <button
//                     onClick={() => setSelectedCA(ca)}
//                     className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
//                   >
//                     Know More
//                   </button>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Details Modal */}
//       <AnimatePresence>
//         {selectedCA && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
//             >
//               {/* Header */}
//               <div className="relative h-56 bg-gray-900 flex items-center justify-center">
//                 {selectedCA.profile_picture ? (
//                   <img 
//                     src={selectedCA.profile_picture} 
//                     alt={selectedCA.name}
//                     className="w-36 h-36 rounded-full object-cover border-4 border-white"
//                   />
//                 ) : (
//                   <div className="w-36 h-36 rounded-full bg-white flex items-center justify-center">
//                     <span className="text-5xl font-bold text-gray-900">
//                       {selectedCA.name.charAt(0).toUpperCase()}
//                     </span>
//                   </div>
//                 )}
                
//                 <button
//                   onClick={() => setSelectedCA(null)}
//                   className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white"
//                 >
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>

//               {/* Body */}
//               <div className="p-8 overflow-y-auto max-h-[calc(90vh-224px)]">
//                 <div className="text-center mb-6">
//                   <h2 className="text-3xl font-bold text-gray-900 mb-2">
//                     {selectedCA.name}
//                   </h2>
//                   {selectedCA.qualification && (
//                     <p className="text-lg text-gray-600">{selectedCA.qualification}</p>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-2 gap-4 mb-6">
//                   <div className="bg-gray-50 rounded-lg p-4 text-center">
//                     <p className="text-sm text-gray-600 mb-1">Specialization</p>
//                     <p className="font-bold text-gray-900">{selectedCA.specialization}</p>
//                   </div>
//                   <div className="bg-gray-50 rounded-lg p-4 text-center">
//                     <p className="text-sm text-gray-600 mb-1">Experience</p>
//                     <p className="font-bold text-gray-900">{selectedCA.experience || 0}+ years</p>
//                   </div>
//                 </div>

//                 {selectedCA.intro && (
//                   <div className="mb-6">
//                     <h3 className="font-bold text-gray-900 mb-2">About</h3>
//                     <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4">
//                       {selectedCA.intro}
//                     </p>
//                   </div>
//                 )}

//                 <button 
//                   onClick={() => handleBookAppointment(selectedCA)}
//                   className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-bold"
//                 >
//                   Book Appointment
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default CAListingSimple;




























// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import toast from 'react-hot-toast';
// import { getCAList } from '../services/api';
// import { useNavigate } from 'react-router-dom';

// const CAListingSimple = () => {
//   const [caList, setCAList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCA, setSelectedCA] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchCAList();
//   }, []);

//   const fetchCAList = async () => {
//     setLoading(true);
//     try {
//       const response = await getCAList();
      
//       if (response.success) {
//         const caData = response.data.cas || response.data || [];
//         const activeCAs = caData.filter(ca => ca.status === 'active');
        
//         // 🔍 COMPREHENSIVE DEBUG
//         console.log('=== CA LISTING DEBUG ===');
//         console.log('Total Active CAs:', activeCAs.length);
//         if (activeCAs.length > 0) {
//           console.log('First CA Full Object:', activeCAs[0]);
//           console.log('First CA Keys:', Object.keys(activeCAs[0]));
//           console.log('ID Fields Check:');
//           console.log('  ca.id:', activeCAs[0].id);
//           console.log('  ca._id:', activeCAs[0]._id);
//           console.log('  ca.ca_id:', activeCAs[0].ca_id);
//           console.log('  ca.userId:', activeCAs[0].userId);
//           console.log('  ca.user_id:', activeCAs[0].user_id);
          
//           console.log('\nAll CA IDs:');
//           activeCAs.forEach((ca, index) => {
//             console.log(`  ${index + 1}. ${ca.name} - ID fields:`, {
//               id: ca.id,
//               _id: ca._id,
//               ca_id: ca.ca_id,
//               userId: ca.userId,
//               user_id: ca.user_id
//             });
//           });
//         }
//         console.log('========================');
        
//         setCAList(activeCAs);
//       } else {
//         toast.error('Failed to load professionals');
//         console.error('❌ API Response not successful:', response);
//       }
//     } catch (error) {
//       toast.error('Failed to load professionals');
//       console.error('❌ Error fetching CA list:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper to get CA ID
//   const getCAId = (ca) => {
//     const id = ca.id || ca._id || ca.ca_id || ca.userId || ca.user_id;
//     console.log(`Getting ID for ${ca.name}:`, id);
//     return id;
//   };

//   const handleBookAppointment = (ca) => {
//     const caId = getCAId(ca);
    
//     console.log('=== BOOKING APPOINTMENT ===');
//     console.log('Selected CA:', ca.name);
//     console.log('Full CA Object:', ca);
//     console.log('Extracted CA ID:', caId);
//     console.log('CA ID Type:', typeof caId);
    
//     if (!caId) {
//       console.error('❌ ERROR: No valid ID found!');
//       toast.error('Unable to book appointment - CA ID not found');
//       return;
//     }
    
//     // ✅ FIXED: Use /book instead of /appointment
//     const url = `/book?ca_id=${caId}`;
//     console.log('✅ Navigating to:', url);
//     console.log('===========================');
    
//     navigate(url);
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 font-poppins font-medium">Loading professionals...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Header */}
//         <div className="text-center mb-8 sm:mb-12">
//           <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 font-archivo">
//             Our Expert Chartered Accountants
//           </h1>
//           <p className="text-base sm:text-lg text-gray-600 font-poppins px-4">
//             Professional CA services for all your financial needs
//           </p>
//         </div>

//         {/* Landscape CA Cards */}
//         <div className='flex items-center justify-center'>
//           <div className="space-y-4 sm:space-y-6 w-[90%]">
//           {caList.map((ca) => {
//             const caId = getCAId(ca);
//             return (
//               <motion.div
//                 key={caId}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden"
//               >
//                 {/* Landscape Card Layout */}
//                 <div className="flex flex-col sm:flex-row h-full">
                  
//                   {/* Left Side - Profile Picture (Square, Full Width/Height) - Smaller Width */}
//                   <div className="relative sm:w-40 md:w-48 lg:w-[25%] h-25 sm:h-auto bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
//                     {ca.profile_picture ? (
//                       <img 
//                         src={ca.profile_picture} 
//                         alt={ca.name}
//                         className="w-full h-full object-contain"
//                       />
//                     ) : (
//                       <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
//                         <span className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-600 font-archivo">
//                           {ca.name.charAt(0).toUpperCase()}
//                         </span>
//                       </div>
//                     )}
                    
//                     {/* Specialization Badge */}
//                     {ca.specialization && (
//                       <div className="absolute top-4 right-4">
//                         <span className="px-3 sm:px-4 py-1.5 bg-blue-600 text-white rounded-full text-xs sm:text-sm font-bold shadow-lg font-poppins">
//                           {ca.specialization}
//                         </span>
//                       </div>
//                     )}
//                   </div>

//                   {/* Right Side - Content */}
//                   <div className="flex-1 p-5 sm:p-6 lg:p-8 flex flex-col justify-between min-h-[240px] sm:min-h-0">
                    
//                     {/* Top Section - Info */}
//                     <div className="flex-1">
//                       {/* Name and Qualification */}
//                       <div className="mb-3">
//                         <h3 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1.5 font-archivo">
//                           {ca.name}
//                         </h3>
//                         {ca.qualification && (
//                           <p className="text-sm sm:text-base text-gray-600 font-medium font-poppins">
//                             {ca.qualification}
//                           </p>
//                         )}
//                       </div>

//                       {/* Info Items */}
//                       <div className="space-y-2 mb-4">
//                         {/* Specialization (shown on larger screens only since badge shows on mobile) */}
//                         {ca.specialization && (
//                           <div className="hidden sm:flex items-center text-sm text-gray-700">
//                             <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                             </svg>
//                             <span className="font-poppins">{ca.specialization}</span>
//                           </div>
//                         )}
                        
//                         {/* Experience */}
//                         <div className="flex items-center text-sm text-gray-700">
//                           <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                           </svg>
//                           <span className="font-poppins">{ca.experience || 0}+ years experience</span>
//                         </div>
//                       </div>

//                       {/* Introduction Preview */}
//                       {ca.intro && (
//                         <p className="text-sm text-gray-600 line-clamp-2 lg:line-clamp-3 leading-relaxed font-poppins mb-4">
//                           {ca.intro}
//                         </p>
//                       )}
//                     </div>

//                     {/* Bottom Section - Buttons */}
//                     <div className="flex flex-col sm:flex-row gap-3 pt-2">
//                       {/* Know More Button */}
//                       <button
//                         onClick={() => setSelectedCA(ca)}
//                         className="flex-1 px-5 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold text-sm sm:text-base flex items-center justify-center gap-2 font-poppins"
//                       >
//                         <span>Know More</span>
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                         </svg>
//                       </button>

//                       {/* Book Now Button */}
//                       <button
//                         onClick={() => handleBookAppointment(ca)}
//                         className="flex-1 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md font-poppins hover:shadow-lg"
//                       >
//                         <span>Book Now</span>
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                         </svg>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>
//         </div>
        
//       </div>

//       {/* Attractive Details Modal */}
//       <AnimatePresence>
//         {selectedCA && (
//           <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.9, y: 20 }}
//               transition={{ type: "spring", duration: 0.5 }}
//               className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
//             >
//               {/* Modal Layout - Landscape Split */}
//               <div className="flex flex-col lg:flex-row max-h-[90vh]">
                
//                 {/* Left Side - Profile & Quick Info */}
//                 <div className="lg:w-2/5 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-8 lg:p-10 text-white relative overflow-hidden">
//                   {/* Decorative Elements */}
//                   <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
//                   <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
                  
//                   {/* Close Button */}
//                   <button
//                     onClick={() => setSelectedCA(null)}
//                     className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all text-white z-10 backdrop-blur-sm"
//                   >
//                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>

//                   <div className="relative z-10 flex flex-col items-center text-center h-full justify-center">
//                     {/* Profile Picture - Circular */}
//                     <div className="mb-6">
//                       {selectedCA.profile_picture ? (
//                         <img 
//                           src={selectedCA.profile_picture} 
//                           alt={selectedCA.name}
//                           className="w-36 h-36 lg:w-44 lg:h-44 rounded-full object-cover border-4 border-white/30 shadow-2xl"
//                         />
//                       ) : (
//                         <div className="w-36 h-36 lg:w-44 lg:h-44 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 shadow-2xl">
//                           <span className="text-6xl lg:text-7xl font-bold text-white font-archivo">
//                             {selectedCA.name.charAt(0).toUpperCase()}
//                           </span>
//                         </div>
//                       )}
//                     </div>

//                     {/* Name */}
//                     <h2 className="text-3xl lg:text-4xl font-bold mb-2 font-archivo">
//                       {selectedCA.name}
//                     </h2>
                    
//                     {/* Qualification */}
//                     {selectedCA.qualification && (
//                       <p className="text-lg text-blue-100 mb-6 font-poppins">
//                         {selectedCA.qualification}
//                       </p>
//                     )}

//                     {/* Quick Stats */}
//                     <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
//                       <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
//                         <div className="flex items-center justify-center gap-2 mb-2">
//                           <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                           </svg>
//                         </div>
//                         <p className="text-xs text-blue-200 mb-1 font-poppins">Specialization</p>
//                         <p className="text-sm font-bold font-archivo">{selectedCA.specialization}</p>
//                       </div>
                      
//                       <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
//                         <div className="flex items-center justify-center gap-2 mb-2">
//                           <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                           </svg>
//                         </div>
//                         <p className="text-xs text-blue-200 mb-1 font-poppins">Experience</p>
//                         <p className="text-sm font-bold font-archivo">{selectedCA.experience || 0}+ years</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right Side - Detailed Info */}
//                 <div className="lg:w-3/5 p-8 lg:p-10 overflow-y-auto bg-gray-50">
//                   {/* Section Title */}
//                   <div className="mb-6">
//                     <h3 className="text-2xl font-bold text-gray-900 mb-2 font-archivo flex items-center gap-2">
//                       <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                       </svg>
//                       Professional Profile
//                     </h3>
//                     <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
//                   </div>

//                   {/* About Section */}
//                   {selectedCA.intro && (
//                     <div className="mb-8">
//                       <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
//                         <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 font-poppins">About</h4>
//                         <p className="text-base text-gray-700 leading-relaxed font-poppins">
//                           {selectedCA.intro}
//                         </p>
//                       </div>
//                     </div>
//                   )}

//                   {/* Expertise Highlights */}
//                   <div className="mb-8">
//                     <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 font-poppins">Expertise</h4>
//                     <div className="grid grid-cols-1 gap-3">
//                       <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-gray-200">
//                         <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                           <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                           </svg>
//                         </div>
//                         <div>
//                           <p className="font-semibold text-gray-900 font-poppins">{selectedCA.specialization}</p>
//                           <p className="text-sm text-gray-500 font-poppins">Specialized services</p>
//                         </div>
//                       </div>
                      
//                       <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-gray-200">
//                         <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                           <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                           </svg>
//                         </div>
//                         <div>
//                           <p className="font-semibold text-gray-900 font-poppins">{selectedCA.experience || 0}+ Years of Experience</p>
//                           <p className="text-sm text-gray-500 font-poppins">Proven track record</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* CTA Section */}
//                   <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
//                     <h4 className="text-xl font-bold mb-2 font-archivo">Ready to get started?</h4>
//                     <p className="text-blue-100 mb-5 font-poppins">
//                       Schedule a consultation with {selectedCA.name.split(' ')[0]} today
//                     </p>
//                     <button 
//                       onClick={() => handleBookAppointment(selectedCA)}
//                       className="w-full px-6 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-bold text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl font-poppins group"
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                       </svg>
//                       <span>Book Appointment Now</span>
//                       <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
//                       </svg>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default CAListingSimple;















import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getCAList } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CAListingSimple = () => {
  const [caList, setCAList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCA, setSelectedCA] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCAList();
  }, []);

  const fetchCAList = async () => {
    setLoading(true);
    try {
      const response = await getCAList();
      
      if (response.success) {
        const caData = response.data.cas || response.data || [];
        const activeCAs = caData.filter(ca => ca.status === 'active');
        
        // 🔍 COMPREHENSIVE DEBUG
        console.log('=== CA LISTING DEBUG ===');
        console.log('Total Active CAs:', activeCAs.length);
        if (activeCAs.length > 0) {
          console.log('First CA Full Object:', activeCAs[0]);
          console.log('First CA Keys:', Object.keys(activeCAs[0]));
          console.log('ID Fields Check:');
          console.log('  ca.id:', activeCAs[0].id);
          console.log('  ca._id:', activeCAs[0]._id);
          console.log('  ca.ca_id:', activeCAs[0].ca_id);
          console.log('  ca.userId:', activeCAs[0].userId);
          console.log('  ca.user_id:', activeCAs[0].user_id);
          
          console.log('\nAll CA IDs:');
          activeCAs.forEach((ca, index) => {
            console.log(`  ${index + 1}. ${ca.name} - ID fields:`, {
              id: ca.id,
              _id: ca._id,
              ca_id: ca.ca_id,
              userId: ca.userId,
              user_id: ca.user_id
            });
          });
        }
        console.log('========================');
        
        setCAList(activeCAs);
      } else {
        toast.error('Failed to load professionals');
        console.error('❌ API Response not successful:', response);
      }
    } catch (error) {
      toast.error('Failed to load professionals');
      console.error('❌ Error fetching CA list:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get CA ID
  const getCAId = (ca) => {
    const id = ca.id || ca._id || ca.ca_id || ca.userId || ca.user_id;
    console.log(`Getting ID for ${ca.name}:`, id);
    return id;
  };

  const handleBookAppointment = (ca) => {
    const caId = getCAId(ca);
    
    console.log('=== BOOKING APPOINTMENT ===');
    console.log('Selected CA:', ca.name);
    console.log('Full CA Object:', ca);
    console.log('Extracted CA ID:', caId);
    console.log('CA ID Type:', typeof caId);
    
    if (!caId) {
      console.error('❌ ERROR: No valid ID found!');
      toast.error('Unable to book appointment - CA ID not found');
      return;
    }
    
    // ✅ FIXED: Use /book instead of /appointment
    const url = `/book?ca_id=${caId}`;
    console.log('✅ Navigating to:', url);
    console.log('===========================');
    
    navigate(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-poppins font-medium">Loading professionals...</p>
        </div>
      </div>
    );
  }

  return (

    <div className="pb-10 bg-[#f4f5f9]">
      <div className="text-center mb-8 sm:mb-12 cas-header h-[80vh] flex items-center justify-center">
        <div className='p-2'>
           <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 font-archivo">
            Our Expert Chartered Accountants
          </h1>
          <p className="text-white sm:text-lg text-gray-600 font-poppins px-4">
            Professional CA services for all your financial needs
          </p>
        </div>
         
        </div>
      <div className="max-w-7xl mx-auto ">
        
        {/* Header */}
        

        {/* Landscape CA Cards - 70% Width */}
        <div className="space-y-4 sm:space-y-6 max-w-[80%] mx-auto ">
          {caList.map((ca) => {
            const caId = getCAId(ca);
            return (
              <motion.div
                key={caId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden"
              >
                {/* Landscape Card Layout */}
                <div className="flex flex-col sm:flex-row h-full">
                  
                  {/* Left Side - Profile Picture (Square, Full Width/Height) - Smaller Width */}
                  <div className="relative sm:w-40 md:w-48 lg:w-56 h-56 sm:h-auto bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {ca.profile_picture ? (
                      <img 
                        src={ca.profile_picture} 
                        alt={ca.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-600 font-archivo">
                          {ca.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    {/* Specialization Badge */}
                    {ca.specialization && (
                      <div className="absolute top-4 right-4">
                        <span className="px-3 sm:px-4 py-1.5 bg-blue-600 text-white rounded-full text-xs sm:text-sm font-bold shadow-lg font-poppins">
                          {ca.specialization}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Side - Content */}
                  <div className="flex-1 p-5 sm:p-6 lg:p-8 flex flex-col justify-between min-h-[240px] sm:min-h-0">
                    
                    {/* Top Section - Info */}
                    <div className="flex-1">
                      {/* Name and Qualification */}
                      <div className="mb-3">
                        <h3 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1.5 font-archivo">
                          {ca.name}
                        </h3>
                        {ca.qualification && (
                          <p className="text-sm sm:text-base text-gray-600 font-medium font-poppins">
                            {ca.qualification}
                          </p>
                        )}
                      </div>

                      {/* Info Items */}
                      <div className="space-y-2 mb-4">
                        {/* Specialization (shown on larger screens only since badge shows on mobile) */}
                        {ca.specialization && (
                          <div className="hidden sm:flex items-center text-sm text-gray-700">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="font-poppins">{ca.specialization}</span>
                          </div>
                        )}
                        
                        {/* Experience */}
                        <div className="flex items-center text-sm text-gray-700">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-poppins">{ca.experience || 0}+ years experience</span>
                        </div>
                      </div>

                      {/* Introduction Preview */}
                      {ca.intro && (
                        <p className="text-sm text-gray-600 line-clamp-2 lg:line-clamp-3 leading-relaxed font-poppins mb-4">
                          {ca.intro}
                        </p>
                      )}
                    </div>

                    {/* Bottom Section - Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      {/* Know More Button */}
                      <button
                        onClick={() => setSelectedCA(ca)}
                        className="flex-1 px-5 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold text-sm sm:text-base flex items-center justify-center gap-2 font-poppins"
                      >
                        <span>Know More</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>

                      {/* Book Now Button */}
                      <button
                        onClick={() => handleBookAppointment(ca)}
                        className="flex-1 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md font-poppins hover:shadow-lg"
                      >
                        <span>Book Now</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Attractive Details Modal */}
      <AnimatePresence>
        {selectedCA && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              {/* Modal Layout - Landscape Split on Desktop, Stacked on Mobile */}
              <div className="flex flex-col lg:flex-row max-h-[90vh]">
                
                {/* Left Side - Profile & Quick Info */}
                <div className="lg:w-2/5 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-6 sm:p-8 lg:p-10 text-white relative overflow-hidden">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
                  
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedCA(null)}
                    className="absolute top-4 left-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all text-white z-10 backdrop-blur-sm"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="relative z-10 flex flex-col items-center text-center">
                    {/* Profile Picture - Circular */}
                    <div className="mb-4 sm:mb-6">
                      {selectedCA.profile_picture ? (
                        <img 
                          src={selectedCA.profile_picture} 
                          alt={selectedCA.name}
                          className="w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 rounded-full object-cover border-4 border-white/30 shadow-2xl"
                        />
                      ) : (
                        <div className="w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 shadow-2xl">
                          <span className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white font-archivo">
                            {selectedCA.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 font-archivo">
                      {selectedCA.name}
                    </h2>
                    
                    {/* Qualification */}
                    {selectedCA.qualification && (
                      <p className="text-base sm:text-lg text-blue-100 mb-4 sm:mb-6 font-poppins">
                        {selectedCA.qualification}
                      </p>
                    )}

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-sm">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
                        <div className="flex items-center justify-center gap-2 mb-1 sm:mb-2">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-xs text-blue-200 mb-1 font-poppins">Specialization</p>
                        <p className="text-xs sm:text-sm font-bold font-archivo">{selectedCA.specialization}</p>
                      </div>
                      
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
                        <div className="flex items-center justify-center gap-2 mb-1 sm:mb-2">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-xs text-blue-200 mb-1 font-poppins">Experience</p>
                        <p className="text-xs sm:text-sm font-bold font-archivo">{selectedCA.experience || 0}+ years</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Detailed Info */}
                <div className="lg:w-3/5 p-6 sm:p-8 lg:p-10 overflow-y-auto bg-gray-50 max-h-[50vh] lg:max-h-full">
                  {/* Section Title */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 font-archivo flex items-center gap-2">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Professional Profile
                    </h3>
                    <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
                  </div>

                  {/* About Section */}
                  {selectedCA.intro && (
                    <div className="mb-6 sm:mb-8">
                      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                        <h4 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wide mb-2 sm:mb-3 font-poppins">About</h4>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-poppins">
                          {selectedCA.intro}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Expertise Highlights */}
                  <div className="mb-6 sm:mb-8">
                    <h4 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 sm:mb-4 font-poppins">Expertise</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm sm:text-base font-semibold text-gray-900 font-poppins">{selectedCA.specialization}</p>
                          <p className="text-xs sm:text-sm text-gray-500 font-poppins">Specialized services</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm sm:text-base font-semibold text-gray-900 font-poppins">{selectedCA.experience || 0}+ Years of Experience</p>
                          <p className="text-xs sm:text-sm text-gray-500 font-poppins">Proven track record</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* CTA Section */}
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 sm:p-6 text-white">
                    <h4 className="text-lg sm:text-xl font-bold mb-2 font-archivo">Ready to get started?</h4>
                    <p className="text-sm sm:text-base text-blue-100 mb-4 sm:mb-5 font-poppins">
                      Schedule a consultation with {selectedCA.name.split(' ')[0]} today
                    </p>
                    <button 
                      onClick={() => handleBookAppointment(selectedCA)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl font-poppins group"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Book Appointment Now</span>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                    
                  </div>
                  
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CAListingSimple;