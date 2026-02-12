// import { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import toast from 'react-hot-toast';
// import { getCAList, createCA, updateCA, deleteCA } from '../../services/api';

// const CA = () => {
//   const [caList, setCAList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
//   const [editingCA, setEditingCA] = useState(null);
//   const [selectedCA, setSelectedCA] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     specialization: '',
//     experience: '',
//     qualification: '',
//     intro: '',
//     status: 'active',
//     profile_picture: null, // ✅ Add profile picture field
//   });
//   const [formErrors, setFormErrors] = useState({});
//   const [imagePreview, setImagePreview] = useState(null); // ✅ Image preview state
//   const [uploadingImage, setUploadingImage] = useState(false); // ✅ Upload loading state
//   const fileInputRef = useRef(null); // ✅ File input reference

//   // Availability states
//   const [unavailability, setUnavailability] = useState([]);
//   const [newUnavailable, setNewUnavailable] = useState({
//     date: '',
//     start_time: '',
//     end_time: '',
//     reason: '',
//   });

//   useEffect(() => {
//     fetchCAList();
//   }, []);

//   const fetchCAList = async () => {
//     setLoading(true);
//     try {
//       console.log('Fetching CA list...');
//       const response = await getCAList();
//       console.log('CA List Response:', response);
      
//       if (response.success) {
//         const caData = response.data.cas || response.data || [];
//         console.log('CA Data received:', caData);
//         setCAList(caData);
//       } else {
//         console.error('Failed to fetch CA list:', response);
//         toast.error(response.message || 'Failed to fetch CA list');
//       }
//     } catch (error) {
//       toast.error('Failed to fetch CA list');
//       console.error('Error fetching CA list:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Image upload handlers
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Validate file type
//     const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
//     if (!validTypes.includes(file.type)) {
//       toast.error('Please select a valid image file (JPEG, PNG, or WebP)');
//       return;
//     }

//     // Validate file size (5MB max)
//     const maxSize = 5 * 1024 * 1024; // 5MB
//     if (file.size > maxSize) {
//       toast.error('Image size should be less than 5MB');
//       return;
//     }

//     setUploadingImage(true);

//     // Convert to base64
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const base64String = reader.result;
      
//       // Compress image if needed
//       compressImage(base64String, (compressedImage) => {
//         setFormData({ ...formData, profile_picture: compressedImage });
//         setImagePreview(compressedImage);
//         setUploadingImage(false);
//         toast.success('Image uploaded successfully');
//       });
//     };
//     reader.onerror = () => {
//       toast.error('Failed to read image');
//       setUploadingImage(false);
//     };
//     reader.readAsDataURL(file);
//   };

//   // ✅ Image compression function
//   const compressImage = (base64Image, callback) => {
//     const img = new Image();
//     img.src = base64Image;
    
//     img.onload = () => {
//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
      
//       // Set max dimensions
//       const maxWidth = 800;
//       const maxHeight = 800;
      
//       let width = img.width;
//       let height = img.height;
      
//       // Calculate new dimensions
//       if (width > height) {
//         if (width > maxWidth) {
//           height = (height * maxWidth) / width;
//           width = maxWidth;
//         }
//       } else {
//         if (height > maxHeight) {
//           width = (width * maxHeight) / height;
//           height = maxHeight;
//         }
//       }
      
//       canvas.width = width;
//       canvas.height = height;
      
//       // Draw and compress
//       ctx.drawImage(img, 0, 0, width, height);
      
//       // Convert to base64 with compression
//       const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
//       callback(compressedBase64);
//     };
//   };

//   const handleRemoveImage = () => {
//     setFormData({ ...formData, profile_picture: null });
//     setImagePreview(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const triggerFileInput = () => {
//     fileInputRef.current?.click();
//   };

//   const validateForm = () => {
//     const errors = {};

//     if (!formData.name.trim()) {
//       errors.name = 'Name is required';
//     }

//     if (!formData.email.trim()) {
//       errors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       errors.email = 'Invalid email format';
//     }

//     if (!formData.phone.trim()) {
//       errors.phone = 'Phone number is required';
//     } else if (!/^[0-9]{10}$/.test(formData.phone)) {
//       errors.phone = 'Invalid phone number';
//     }

//     if (!formData.specialization.trim()) {
//       errors.specialization = 'Specialization is required';
//     }

//     if (!formData.experience.trim()) {
//       errors.experience = 'Experience is required';
//     } else if (isNaN(formData.experience) || Number(formData.experience) < 0) {
//       errors.experience = 'Experience must be a valid number';
//     }

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       toast.error('Please fix the form errors');
//       return;
//     }

//     try {
//       const submitData = {
//         ...formData,
//         experience: Number(formData.experience),
//         phone: formData.phone.trim(),
//         email: formData.email.trim().toLowerCase(),
//         profile_picture: formData.profile_picture, // ✅ Include profile picture
//       };

//       console.log('Submitting CA data:', submitData);

//       let response;
//       if (editingCA) {
//         // ✅ For update: only send profile_picture if it changed
//         const updateData = { ...submitData };
//         if (imagePreview === editingCA.profile_picture) {
//           delete updateData.profile_picture; // Don't send if unchanged
//         }
//         response = await updateCA(editingCA.id, updateData);
//       } else {
//         response = await createCA(submitData);
//       }

//       console.log('API Response:', response);

//       if (response && (response.success === true || response.data)) {
//         toast.success(editingCA ? 'CA updated successfully' : 'CA added successfully');
//         setShowModal(false);
//         resetForm();
//         await fetchCAList();
//       } else {
//         toast.error(response?.message || 'Operation failed');
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || error.message || 'Operation failed';
//       toast.error(errorMessage);
//       console.error('Error details:', {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status
//       });
//     }
//   };

//   const handleEdit = (ca) => {
//     console.log('Editing CA:', ca);
//     setEditingCA(ca);
//     setFormData({
//       name: ca.name || '',
//       email: ca.email || '',
//       phone: ca.phone || ca.mobile || '',
//       specialization: ca.specialization || '',
//       experience: ca.experience !== undefined && ca.experience !== null ? ca.experience.toString() : '0', // ✅ Default to '0' instead of ''
//       qualification: ca.qualification || '',
//       intro: ca.intro || '',
//       status: ca.status || 'active',
//       profile_picture: ca.profile_picture || null,
//     });
//     setImagePreview(ca.profile_picture || null);
//     setShowModal(true);
//   };

//   const handleDelete = async (caId) => {
//     if (!window.confirm('Are you sure you want to delete this CA?')) {
//       return;
//     }

//     try {
//       const response = await deleteCA(caId);
//       if (response.success) {
//         toast.success('CA deleted successfully');
//         fetchCAList();
//       }
//     } catch (error) {
//       toast.error('Failed to delete CA');
//       console.error(error);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       email: '',
//       phone: '',
//       specialization: '',
//       experience: '',
//       qualification: '',
//       intro: '',
//       status: 'active',
//       profile_picture: null, // ✅ Reset profile picture
//     });
//     setFormErrors({});
//     setEditingCA(null);
//     setImagePreview(null); // ✅ Reset preview
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const handleModalClose = () => {
//     setShowModal(false);
//     resetForm();
//   };

//   // ==================== AVAILABILITY MANAGEMENT ====================

//   const handleManageAvailability = (ca) => {
//     setSelectedCA(ca);
//     setUnavailability(ca.unavailable_slots || []);
//     setShowAvailabilityModal(true);
//   };

//   const handleAddUnavailability = () => {
//     const { date, start_time, end_time, reason } = newUnavailable;

//     if (!date || !start_time || !end_time) {
//       toast.error('Please fill in all required fields');
//       return;
//     }

//     if (end_time <= start_time) {
//       toast.error('End time must be after start time');
//       return;
//     }

//     const newSlot = {
//       id: Date.now().toString(),
//       date,
//       start_time,
//       end_time,
//       reason: reason.trim(),
//       created_at: new Date().toISOString(),
//     };

//     setUnavailability([...unavailability, newSlot]);
//     setNewUnavailable({
//       date: '',
//       start_time: '',
//       end_time: '',
//       reason: '',
//     });
//     toast.success('Unavailability added');
//   };

//   const handleRemoveUnavailability = (slotId) => {
//     setUnavailability(unavailability.filter(slot => slot.id !== slotId));
//     toast.success('Unavailability removed');
//   };

//   const handleSaveAvailability = async () => {
//     try {
//       const response = await updateCA(selectedCA.id, {
//         unavailable_slots: unavailability,
//       });

//       if (response && response.success) {
//         toast.success('Availability updated successfully');
//         setShowAvailabilityModal(false);
//         setSelectedCA(null);
//         await fetchCAList();
//       } else {
//         toast.error('Failed to update availability');
//       }
//     } catch (error) {
//       toast.error('Failed to update availability');
//       console.error(error);
//     }
//   };

//   const handleCloseAvailabilityModal = () => {
//     setShowAvailabilityModal(false);
//     setSelectedCA(null);
//     setUnavailability([]);
//     setNewUnavailable({
//       date: '',
//       start_time: '',
//       end_time: '',
//       reason: '',
//     });
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-800 mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading CA list...</p>
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
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                 </svg>
//               </div>
//               <div>
//                 <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Chartered Accountants</h1>
//                 <p className="text-gray-600 text-sm md:text-base mt-1">Manage your professional CA team</p>
//               </div>
//             </div>
//             <button
//               onClick={() => setShowModal(true)}
//               className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-semibold flex items-center gap-2 whitespace-nowrap"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//               </svg>
//               Add New CA
//             </button>
//           </div>
//         </motion.div>

//         {caList.length === 0 ? (
//           /* Empty State */
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
//           >
//             <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//               </svg>
//             </div>
//             <h3 className="text-xl font-bold text-gray-900 mb-2">No CAs Added Yet</h3>
//             <p className="text-gray-500 mb-6">Start building your team by adding your first Chartered Accountant</p>
//             <button
//               onClick={() => setShowModal(true)}
//               className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-semibold inline-flex items-center gap-2"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//               </svg>
//               Add Your First CA
//             </button>
//           </motion.div>
//         ) : (
//           /* CA Cards Grid */
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {caList.map((ca) => (
//               <motion.div
//                 key={ca.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all overflow-hidden"
//               >
//                 {/* Card Header */}
//                 <div className="border-b border-gray-200 p-6">
//                   <div className="flex items-start justify-between mb-4">
//                     {/* ✅ Profile Picture or Initial */}
//                     {ca.profile_picture ? (
//                       <img 
//                         src={ca.profile_picture} 
//                         alt={ca.name}
//                         className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
//                       />
//                     ) : (
//                       <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center">
//                         <span className="text-2xl font-bold text-white">
//                           {ca.name.charAt(0).toUpperCase()}
//                         </span>
//                       </div>
//                     )}
//                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                       ca.status === 'active' 
//                         ? 'bg-green-100 text-green-800 border border-green-200' 
//                         : 'bg-gray-100 text-gray-800 border border-gray-200'
//                     }`}>
//                       {ca.status.toUpperCase()}
//                     </span>
//                   </div>
//                   <h3 className="text-xl font-bold text-gray-900 mb-1">{ca.name}</h3>
//                   {ca.qualification && (
//                     <p className="text-gray-600 text-sm font-medium">{ca.qualification}</p>
//                   )}
//                 </div>

//                 {/* Card Body */}
//                 <div className="p-6">
//                   {ca.intro && (
//                     <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
//                       {ca.intro}
//                     </p>
//                   )}
                  
//                   <div className="space-y-3">
//                     <div className="flex items-center text-sm text-gray-700">
//                       <svg className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                       </svg>
//                       <span className="truncate">{ca.email}</span>
//                     </div>
//                     <div className="flex items-center text-sm text-gray-700">
//                       <svg className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                       </svg>
//                       <span>{ca.phone || ca.mobile}</span>
//                     </div>
//                     <div className="flex items-center text-sm text-gray-700">
//                       <svg className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                       </svg>
//                       <span>{ca.specialization}</span>
//                     </div>
//                     <div className="flex items-center text-sm text-gray-700">
//                       <svg className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                       <span>{ca.experience || 0} years experience</span>
//                     </div>

//                     {ca.unavailable_slots && ca.unavailable_slots.length > 0 && (
//                       <div className="flex items-center text-sm text-amber-700 bg-amber-50 rounded-lg p-2 mt-2 border border-amber-200">
//                         <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                         </svg>
//                         <span className="font-semibold">{ca.unavailable_slots.length} unavailable slot(s)</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Card Footer */}
//                 <div className="px-6 pb-6 flex flex-col sm:flex-row gap-2">
//                   <button
//                     onClick={() => handleEdit(ca)}
//                     className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleManageAvailability(ca)}
//                     className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold"
//                   >
//                     Availability
//                   </button>
//                   <button
//                     onClick={() => handleDelete(ca.id)}
//                     className="px-4 py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-semibold border border-red-200"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}

//         {/* CA Form Modal */}
//         <AnimatePresence>
//           {showModal && (
//             <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.95 }}
//                 className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-hidden"
//               >
//                 <div className="border-b border-gray-200 p-6 flex items-center justify-between">
//                   <h2 className="text-2xl font-bold text-gray-900">
//                     {editingCA ? 'Edit CA Details' : 'Add New CA'}
//                   </h2>
//                   <button
//                     onClick={handleModalClose}
//                     className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
//                   >
//                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>

//                 <form onSubmit={handleSubmit}>
//                   <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(95vh-180px)]">
                    
//                     {/* ✅ Profile Picture Upload Section */}
//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-semibold text-gray-700 mb-3">
//                         Profile Picture
//                       </label>
//                       <div className="flex items-center gap-4">
//                         {imagePreview ? (
//                           <div className="relative">
//                             <img 
//                               src={imagePreview} 
//                               alt="Profile preview" 
//                               className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
//                             />
//                             <button
//                               type="button"
//                               onClick={handleRemoveImage}
//                               className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
//                             >
//                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                               </svg>
//                             </button>
//                           </div>
//                         ) : (
//                           <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
//                             <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                             </svg>
//                           </div>
//                         )}
                        
//                         <div className="flex-1">
//                           <input
//                             ref={fileInputRef}
//                             type="file"
//                             accept="image/jpeg,image/jpg,image/png,image/webp"
//                             onChange={handleImageChange}
//                             className="hidden"
//                           />
//                           <button
//                             type="button"
//                             onClick={triggerFileInput}
//                             disabled={uploadingImage}
//                             className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//                           >
//                             {uploadingImage ? 'Uploading...' : 'Choose Image'}
//                           </button>
//                           <p className="text-xs text-gray-500 mt-2">
//                             JPEG, PNG, or WebP. Max 5MB.
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                       <div className="md:col-span-2">
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           Full Name <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           value={formData.name}
//                           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                           className={`w-full px-4 py-2.5 border ${
//                             formErrors.name ? 'border-red-500' : 'border-gray-300'
//                           } rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all`}
//                           placeholder="Enter full name"
//                         />
//                         {formErrors.name && <p className="mt-1.5 text-sm text-red-600">{formErrors.name}</p>}
//                       </div>

//                       <div className="md:col-span-2">
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           Qualification
//                         </label>
//                         <input
//                           type="text"
//                           value={formData.qualification}
//                           onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
//                           className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
//                           placeholder="e.g., CA, FCA, ACA"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           Email Address <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="email"
//                           value={formData.email}
//                           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                           className={`w-full px-4 py-2.5 border ${
//                             formErrors.email ? 'border-red-500' : 'border-gray-300'
//                           } rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all`}
//                           placeholder="email@example.com"
//                         />
//                         {formErrors.email && <p className="mt-1.5 text-sm text-red-600">{formErrors.email}</p>}
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           Phone Number <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="tel"
//                           value={formData.phone}
//                           onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                           className={`w-full px-4 py-2.5 border ${
//                             formErrors.phone ? 'border-red-500' : 'border-gray-300'
//                           } rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all`}
//                           placeholder="10-digit phone number"
//                           maxLength="10"
//                         />
//                         {formErrors.phone && <p className="mt-1.5 text-sm text-red-600">{formErrors.phone}</p>}
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           Specialization <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           value={formData.specialization}
//                           onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
//                           className={`w-full px-4 py-2.5 border ${
//                             formErrors.specialization ? 'border-red-500' : 'border-gray-300'
//                           } rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all`}
//                           placeholder="e.g., Tax, Audit, Corporate"
//                         />
//                         {formErrors.specialization && <p className="mt-1.5 text-sm text-red-600">{formErrors.specialization}</p>}
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           Experience (Years) <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="number"
//                           value={formData.experience}
//                           onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
//                           className={`w-full px-4 py-2.5 border ${
//                             formErrors.experience ? 'border-red-500' : 'border-gray-300'
//                           } rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all`}
//                           placeholder="Years of experience"
//                           min="0"
//                         />
//                         {formErrors.experience && <p className="mt-1.5 text-sm text-red-600">{formErrors.experience}</p>}
//                       </div>

//                       <div className="md:col-span-2">
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           Professional Introduction
//                         </label>
//                         <textarea
//                           value={formData.intro}
//                           onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
//                           className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all resize-none"
//                           placeholder="Brief professional introduction..."
//                           rows="4"
//                         />
//                       </div>

//                       <div className="md:col-span-2">
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           Status
//                         </label>
//                         <select
//                           value={formData.status}
//                           onChange={(e) => setFormData({ ...formData, status: e.target.value })}
//                           className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
//                         >
//                           <option value="active">Active</option>
//                           <option value="inactive">Inactive</option>
//                         </select>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3 border-t border-gray-200">
//                     <button
//                       type="button"
//                       onClick={handleModalClose}
//                       className="flex-1 px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       disabled={uploadingImage}
//                       className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {uploadingImage ? 'Processing...' : (editingCA ? 'Update CA' : 'Add CA')}
//                     </button>
//                   </div>
//                 </form>
//               </motion.div>
//             </div>
//           )}
//         </AnimatePresence>

//         {/* Availability Management Modal - Same as before */}
//         <AnimatePresence>
//           {showAvailabilityModal && selectedCA && (
//             <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.95 }}
//                 className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden"
//               >
//                 <div className="border-b border-gray-200 p-6 flex items-center justify-between">
//                   <div>
//                     <h2 className="text-2xl font-bold text-gray-900">
//                       Manage Availability
//                     </h2>
//                     <p className="text-gray-600 mt-1">
//                       {selectedCA.name} - Set unavailable dates and times
//                     </p>
//                   </div>
//                   <button
//                     onClick={handleCloseAvailabilityModal}
//                     className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
//                   >
//                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>

//                 <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(95vh-180px)]">
//                   {/* Add New Unavailability */}
//                   <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
//                     <h3 className="text-lg font-bold text-gray-900 mb-4">
//                       Add Unavailable Time Slot
//                     </h3>
                    
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           Date <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="date"
//                           value={newUnavailable.date}
//                           onChange={(e) => setNewUnavailable({ ...newUnavailable, date: e.target.value })}
//                           className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
//                           min={new Date().toISOString().split('T')[0]}
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           Reason (Optional)
//                         </label>
//                         <input
//                           type="text"
//                           value={newUnavailable.reason}
//                           onChange={(e) => setNewUnavailable({ ...newUnavailable, reason: e.target.value })}
//                           className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
//                           placeholder="e.g., Personal leave, Training"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           Start Time <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="time"
//                           value={newUnavailable.start_time}
//                           onChange={(e) => setNewUnavailable({ ...newUnavailable, start_time: e.target.value })}
//                           className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           End Time <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="time"
//                           value={newUnavailable.end_time}
//                           onChange={(e) => setNewUnavailable({ ...newUnavailable, end_time: e.target.value })}
//                           className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
//                         />
//                       </div>
//                     </div>

//                     <button
//                       onClick={handleAddUnavailability}
//                       className="mt-4 w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-semibold flex items-center justify-center gap-2"
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                       </svg>
//                       Add Unavailable Slot
//                     </button>
//                   </div>

//                   {/* List of Unavailable Slots */}
//                   <div>
//                     <h3 className="text-lg font-bold text-gray-900 mb-4">
//                       Unavailable Time Slots ({unavailability.length})
//                     </h3>

//                     {unavailability.length === 0 ? (
//                       <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
//                         <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                         </svg>
//                         <p className="text-gray-500 font-medium">No unavailable slots set</p>
//                         <p className="text-sm text-gray-400 mt-1">This CA is available at all times</p>
//                       </div>
//                     ) : (
//                       <div className="space-y-3">
//                         {unavailability.map((slot) => (
//                           <motion.div
//                             key={slot.id}
//                             initial={{ opacity: 0, x: -20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             exit={{ opacity: 0, x: 20 }}
//                             className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
//                           >
//                             <div className="flex items-start justify-between">
//                               <div className="flex-1">
//                                 <div className="flex items-center gap-2 mb-2">
//                                   <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                   </svg>
//                                   <span className="font-bold text-gray-900">
//                                     {new Date(slot.date).toLocaleDateString('en-US', { 
//                                       weekday: 'long', 
//                                       year: 'numeric', 
//                                       month: 'long', 
//                                       day: 'numeric' 
//                                     })}
//                                   </span>
//                                 </div>
//                                 <div className="flex items-center gap-2 text-gray-700 mb-1">
//                                   <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                   </svg>
//                                   <span className="font-semibold text-sm">
//                                     {slot.start_time} - {slot.end_time}
//                                   </span>
//                                 </div>
//                                 {slot.reason && (
//                                   <p className="text-sm text-gray-600 ml-6 italic">{slot.reason}</p>
//                                 )}
//                               </div>
//                               <button
//                                 onClick={() => handleRemoveUnavailability(slot.id)}
//                                 className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                                 title="Remove"
//                               >
//                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                                 </svg>
//                               </button>
//                             </div>
//                           </motion.div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3 border-t border-gray-200">
//                   <button
//                     type="button"
//                     onClick={handleCloseAvailabilityModal}
//                     className="flex-1 px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleSaveAvailability}
//                     className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
//                   >
//                     Save Availability
//                   </button>
//                 </div>
//               </motion.div>
//             </div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default CA;

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getCAList, createCA, updateCA, deleteCA } from '../../services/api';

const CA = () => {
  const [caList, setCAList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [editingCA, setEditingCA] = useState(null);
  const [selectedCA, setSelectedCA] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    qualification: '',
    intro: '',
    status: 'active',
    profile_picture: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);
  const fileInputRef = useRef(null);

  // Availability states
  const [unavailability, setUnavailability] = useState([]);
  const [newUnavailable, setNewUnavailable] = useState({
    date: '',
    start_time: '',
    end_time: '',
    reason: '',
  });

  useEffect(() => {
    fetchCAList();
  }, []);

  const fetchCAList = async () => {
    setLoading(true);
    try {
      console.log('Fetching CA list...');
      const response = await getCAList();
      console.log('CA List Response:', response);
      
      if (response.success) {
        const caData = response.data.cas || response.data || [];
        console.log('CA Data received:', caData);
        
        // ✅ Log unavailability data for debugging
        caData.forEach(ca => {
          console.log(`CA: ${ca.name}, Unavailable Slots:`, ca.unavailable_slots);
        });
        
        setCAList(caData);
      } else {
        console.error('Failed to fetch CA list:', response);
        toast.error(response.message || 'Failed to fetch CA list');
      }
    } catch (error) {
      toast.error('Failed to fetch CA list');
      console.error('Error fetching CA list:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Image upload handlers
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      
      // Compress image if needed
      compressImage(base64String, (compressedImage) => {
        setFormData({ ...formData, profile_picture: compressedImage });
        setImagePreview(compressedImage);
        setUploadingImage(false);
        toast.success('Image ready to upload');
      });
    };
    reader.onerror = () => {
      toast.error('Failed to read image');
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  // ✅ Image compression function
  const compressImage = (base64Image, callback) => {
    const img = new Image();
    img.src = base64Image;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set max dimensions
      const maxWidth = 800;
      const maxHeight = 800;
      
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to base64 with compression
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
      callback(compressedBase64);
    };
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, profile_picture: null });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      errors.phone = 'Invalid phone number';
    }

    if (!formData.specialization.trim()) {
      errors.specialization = 'Specialization is required';
    }

    if (!formData.experience.trim()) {
      errors.experience = 'Experience is required';
    } else if (isNaN(formData.experience) || Number(formData.experience) < 0) {
      errors.experience = 'Experience must be a valid number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    // ✅ Set submitting state to disable button
    setSubmittingForm(true);

    try {
      const submitData = {
        ...formData,
        experience: Number(formData.experience),
        phone: formData.phone.trim(),
        email: formData.email.trim().toLowerCase(),
        profile_picture: formData.profile_picture,
      };

      console.log('Submitting CA data:', submitData);

      // ✅ Show appropriate loading message
      const loadingToast = toast.loading(
        formData.profile_picture 
          ? 'Uploading image to Cloudinary...' 
          : editingCA ? 'Updating CA...' : 'Creating CA...'
      );

      let response;
      if (editingCA) {
        const updateData = { ...submitData };
        if (imagePreview === editingCA.profile_picture) {
          delete updateData.profile_picture;
        }
        response = await updateCA(editingCA.id, updateData);
      } else {
        response = await createCA(submitData);
      }

      // ✅ Dismiss loading toast
      toast.dismiss(loadingToast);

      console.log('API Response:', response);

      if (response && (response.success === true || response.data)) {
        toast.success(editingCA ? 'CA updated successfully' : 'CA added successfully');
        setShowModal(false);
        resetForm();
        await fetchCAList();
      } else {
        toast.error(response?.message || 'Operation failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Operation failed';
      toast.error(errorMessage);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } finally {
      // ✅ Re-enable button after operation completes
      setSubmittingForm(false);
    }
  };

  const handleEdit = (ca) => {
    console.log('Editing CA:', ca);
    setEditingCA(ca);
    setFormData({
      name: ca.name || '',
      email: ca.email || '',
      phone: ca.phone || ca.mobile || '',
      specialization: ca.specialization || '',
      experience: ca.experience !== undefined && ca.experience !== null ? ca.experience.toString() : '0',
      qualification: ca.qualification || '',
      intro: ca.intro || '',
      status: ca.status || 'active',
      profile_picture: ca.profile_picture || null,
    });
    setImagePreview(ca.profile_picture || null);
    setShowModal(true);
  };

  const handleDelete = async (caId) => {
    if (!window.confirm('Are you sure you want to delete this CA?')) {
      return;
    }

    try {
      const response = await deleteCA(caId);
      if (response.success) {
        toast.success('CA deleted successfully');
        fetchCAList();
      }
    } catch (error) {
      toast.error('Failed to delete CA');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialization: '',
      experience: '',
      qualification: '',
      intro: '',
      status: 'active',
      profile_picture: null,
    });
    setFormErrors({});
    setEditingCA(null);
    setImagePreview(null);
    setSubmittingForm(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
  };

  // ==================== AVAILABILITY MANAGEMENT ====================

  const handleManageAvailability = (ca) => {
    console.log('Managing availability for CA:', ca);
    console.log('Unavailable slots:', ca.unavailable_slots);
    setSelectedCA(ca);
    setUnavailability(ca.unavailable_slots || []);
    setShowAvailabilityModal(true);
  };

  const handleAddUnavailability = () => {
    const { date, start_time, end_time, reason } = newUnavailable;

    if (!date || !start_time || !end_time) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (end_time <= start_time) {
      toast.error('End time must be after start time');
      return;
    }

    const newSlot = {
      id: Date.now().toString(),
      date,
      start_time,
      end_time,
      reason: reason.trim(),
      created_at: new Date().toISOString(),
    };

    setUnavailability([...unavailability, newSlot]);
    setNewUnavailable({
      date: '',
      start_time: '',
      end_time: '',
      reason: '',
    });
    toast.success('Unavailability added');
  };

  const handleRemoveUnavailability = (slotId) => {
    setUnavailability(unavailability.filter(slot => slot.id !== slotId));
    toast.success('Unavailability removed');
  };

  const handleSaveAvailability = async () => {
    try {
      console.log('Saving unavailability slots:', unavailability);
      
      const response = await updateCA(selectedCA.id, {
        unavailable_slots: unavailability,
      });

      console.log('Save availability response:', response);

      if (response && response.success) {
        toast.success('Availability updated successfully');
        setShowAvailabilityModal(false);
        setSelectedCA(null);
        await fetchCAList();
      } else {
        toast.error('Failed to update availability');
      }
    } catch (error) {
      toast.error('Failed to update availability');
      console.error(error);
    }
  };

  const handleCloseAvailabilityModal = () => {
    setShowAvailabilityModal(false);
    setSelectedCA(null);
    setUnavailability([]);
    setNewUnavailable({
      date: '',
      start_time: '',
      end_time: '',
      reason: '',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-800 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading CA list...</p>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Chartered Accountants</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Manage your professional CA team</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-semibold flex items-center gap-2 whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New CA
            </button>
          </div>
        </motion.div>

        {caList.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No CAs Added Yet</h3>
            <p className="text-gray-500 mb-6">Start building your team by adding your first Chartered Accountant</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-semibold inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Your First CA
            </button>
          </motion.div>
        ) : (
          /* CA Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caList.map((ca) => (
              <motion.div
                key={ca.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all overflow-hidden"
              >
                {/* Card Header */}
                <div className="border-b border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    {/* ✅ Profile Picture with error handling */}
                    {ca.profile_picture ? (
                      <img 
                        src={ca.profile_picture} 
                        alt={ca.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                        onError={(e) => {
                          console.error('Failed to load image for:', ca.name);
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {ca.name?.charAt(0)?.toUpperCase() || 'C'}
                        </span>
                      </div>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      ca.status === 'active' 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      {ca.status?.toUpperCase() || 'ACTIVE'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{ca.name}</h3>
                  {ca.qualification && (
                    <p className="text-gray-600 text-sm font-medium">{ca.qualification}</p>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {ca.intro && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {ca.intro}
                    </p>
                  )}
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-700">
                      <svg className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="truncate">{ca.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <svg className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{ca.phone || ca.mobile}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <svg className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{ca.specialization}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <svg className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{ca.experience || 0} years experience</span>
                    </div>

                    {/* ✅ Enhanced unavailability display with better checking */}
                    {ca.unavailable_slots && Array.isArray(ca.unavailable_slots) && ca.unavailable_slots.length > 0 && (
                      <div className="flex items-center text-sm text-amber-700 bg-amber-50 rounded-lg p-2 mt-2 border border-amber-200">
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">{ca.unavailable_slots.length} unavailable slot(s)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 pb-6 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleEdit(ca)}
                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleManageAvailability(ca)}
                    className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold"
                  >
                    Availability
                  </button>
                  <button
                    onClick={() => handleDelete(ca.id)}
                    className="px-4 py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-semibold border border-red-200"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* CA Form Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-hidden"
              >
                <div className="border-b border-gray-200 p-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingCA ? 'Edit CA Details' : 'Add New CA'}
                  </h2>
                  <button
                    onClick={handleModalClose}
                    disabled={submittingForm}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(95vh-180px)]">
                    
                    {/* ✅ Profile Picture Upload Section */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Profile Picture
                      </label>
                      <div className="flex items-center gap-4">
                        {imagePreview ? (
                          <div className="relative">
                            <img 
                              src={imagePreview} 
                              alt="Profile preview" 
                              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              disabled={submittingForm}
                              className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleImageChange}
                            disabled={submittingForm}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={triggerFileInput}
                            disabled={uploadingImage || submittingForm}
                            className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {uploadingImage ? 'Processing...' : 'Choose Image'}
                          </button>
                          <p className="text-xs text-gray-500 mt-2">
                            JPEG, PNG, or WebP. Max 5MB.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          disabled={submittingForm}
                          className={`w-full px-4 py-2.5 border ${
                            formErrors.name ? 'border-red-500' : 'border-gray-300'
                          } rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                          placeholder="Enter full name"
                        />
                        {formErrors.name && <p className="mt-1.5 text-sm text-red-600">{formErrors.name}</p>}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Qualification
                        </label>
                        <input
                          type="text"
                          value={formData.qualification}
                          onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                          disabled={submittingForm}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="e.g., CA, FCA, ACA"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={submittingForm}
                          className={`w-full px-4 py-2.5 border ${
                            formErrors.email ? 'border-red-500' : 'border-gray-300'
                          } rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                          placeholder="email@example.com"
                        />
                        {formErrors.email && <p className="mt-1.5 text-sm text-red-600">{formErrors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          disabled={submittingForm}
                          className={`w-full px-4 py-2.5 border ${
                            formErrors.phone ? 'border-red-500' : 'border-gray-300'
                          } rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                          placeholder="10-digit phone number"
                          maxLength="10"
                        />
                        {formErrors.phone && <p className="mt-1.5 text-sm text-red-600">{formErrors.phone}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Specialization <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.specialization}
                          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                          disabled={submittingForm}
                          className={`w-full px-4 py-2.5 border ${
                            formErrors.specialization ? 'border-red-500' : 'border-gray-300'
                          } rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                          placeholder="e.g., Tax, Audit, Corporate"
                        />
                        {formErrors.specialization && <p className="mt-1.5 text-sm text-red-600">{formErrors.specialization}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Experience (Years) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={formData.experience}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          disabled={submittingForm}
                          className={`w-full px-4 py-2.5 border ${
                            formErrors.experience ? 'border-red-500' : 'border-gray-300'
                          } rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                          placeholder="Years of experience"
                          min="0"
                        />
                        {formErrors.experience && <p className="mt-1.5 text-sm text-red-600">{formErrors.experience}</p>}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Professional Introduction
                        </label>
                        <textarea
                          value={formData.intro}
                          onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
                          disabled={submittingForm}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="Brief professional introduction..."
                          rows="4"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          disabled={submittingForm}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleModalClose}
                      disabled={submittingForm}
                      className="flex-1 px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploadingImage || submittingForm}
                      className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {/* ✅ Loading spinner when submitting */}
                      {submittingForm && (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {submittingForm 
                        ? 'Uploading to Cloudinary...' 
                        : uploadingImage 
                        ? 'Processing Image...' 
                        : (editingCA ? 'Update CA' : 'Add CA')
                      }
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Availability Management Modal */}
        <AnimatePresence>
          {showAvailabilityModal && selectedCA && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden"
              >
                <div className="border-b border-gray-200 p-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Manage Availability
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {selectedCA.name} - Set unavailable dates and times
                    </p>
                  </div>
                  <button
                    onClick={handleCloseAvailabilityModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(95vh-180px)]">
                  {/* Add New Unavailability */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Add Unavailable Time Slot
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={newUnavailable.date}
                          onChange={(e) => setNewUnavailable({ ...newUnavailable, date: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Reason (Optional)
                        </label>
                        <input
                          type="text"
                          value={newUnavailable.reason}
                          onChange={(e) => setNewUnavailable({ ...newUnavailable, reason: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                          placeholder="e.g., Personal leave, Training"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Start Time <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="time"
                          value={newUnavailable.start_time}
                          onChange={(e) => setNewUnavailable({ ...newUnavailable, start_time: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          End Time <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="time"
                          value={newUnavailable.end_time}
                          onChange={(e) => setNewUnavailable({ ...newUnavailable, end_time: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleAddUnavailability}
                      className="mt-4 w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-semibold flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Unavailable Slot
                    </button>
                  </div>

                  {/* List of Unavailable Slots */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Unavailable Time Slots ({unavailability.length})
                    </h3>

                    {unavailability.length === 0 ? (
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-500 font-medium">No unavailable slots set</p>
                        <p className="text-sm text-gray-400 mt-1">This CA is available at all times</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {unavailability.map((slot) => (
                          <motion.div
                            key={slot.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span className="font-bold text-gray-900">
                                    {new Date(slot.date).toLocaleDateString('en-US', { 
                                      weekday: 'long', 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700 mb-1">
                                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="font-semibold text-sm">
                                    {slot.start_time} - {slot.end_time}
                                  </span>
                                </div>
                                {slot.reason && (
                                  <p className="text-sm text-gray-600 ml-6 italic">{slot.reason}</p>
                                )}
                              </div>
                              <button
                                onClick={() => handleRemoveUnavailability(slot.id)}
                                className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remove"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseAvailabilityModal}
                    className="flex-1 px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAvailability}
                    className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                  >
                    Save Availability
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CA;