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
      const response = await getCAList();
      if (response.success) {
        const caData = response.data.cas || response.data || [];
        setCAList(caData);
      } else {
        toast.error(response.message || 'Failed to fetch CA list');
      }
    } catch (error) {
      toast.error('Failed to fetch CA list');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      compressImage(reader.result, (compressedImage) => {
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

  const compressImage = (base64Image, callback) => {
    const img = new Image();
    img.src = base64Image;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const maxWidth = 800;
      const maxHeight = 800;
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxWidth) { height = (height * maxWidth) / width; width = maxWidth; }
      } else {
        if (height > maxHeight) { width = (width * maxHeight) / height; height = maxHeight; }
      }
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      callback(canvas.toDataURL('image/jpeg', 0.8));
    };
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, profile_picture: null });
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email format';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    else if (!/^[0-9]{10}$/.test(formData.phone)) errors.phone = 'Invalid phone number';
    if (!formData.specialization.trim()) errors.specialization = 'Specialization is required';
    if (!formData.experience.trim()) errors.experience = 'Experience is required';
    else if (isNaN(formData.experience) || Number(formData.experience) < 0) errors.experience = 'Experience must be a valid number';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) { toast.error('Please fix the form errors'); return; }
    setSubmittingForm(true);
    try {
      const submitData = {
        ...formData,
        experience: Number(formData.experience),
        phone: formData.phone.trim(),
        email: formData.email.trim().toLowerCase(),
        profile_picture: formData.profile_picture,
      };
      const loadingToast = toast.loading(
        formData.profile_picture ? 'Uploading image to Cloudinary...' : editingCA ? 'Updating CA...' : 'Creating CA...'
      );
      let response;
      if (editingCA) {
        const updateData = { ...submitData };
        if (imagePreview === editingCA.profile_picture) delete updateData.profile_picture;
        response = await updateCA(editingCA.id, updateData);
      } else {
        response = await createCA(submitData);
      }
      toast.dismiss(loadingToast);
      if (response && (response.success === true || response.data)) {
        toast.success(editingCA ? 'CA updated successfully' : 'CA added successfully');
        setShowModal(false);
        resetForm();
        await fetchCAList();
      } else {
        toast.error(response?.message || 'Operation failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Operation failed');
    } finally {
      setSubmittingForm(false);
    }
  };

  const handleEdit = (ca) => {
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
    if (!window.confirm('Are you sure you want to delete this CA?')) return;
    try {
      const response = await deleteCA(caId);
      if (response.success) { toast.success('CA deleted successfully'); fetchCAList(); }
    } catch (error) {
      toast.error('Failed to delete CA');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', specialization: '', experience: '', qualification: '', intro: '', status: 'active', profile_picture: null });
    setFormErrors({});
    setEditingCA(null);
    setImagePreview(null);
    setSubmittingForm(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleModalClose = () => { setShowModal(false); resetForm(); };

  const handleManageAvailability = (ca) => {
    setSelectedCA(ca);
    setUnavailability(ca.unavailable_slots || []);
    setShowAvailabilityModal(true);
  };

  const handleAddUnavailability = () => {
    const { date, start_time, end_time, reason } = newUnavailable;
    if (!date || !start_time || !end_time) { toast.error('Please fill in all required fields'); return; }
    if (end_time <= start_time) { toast.error('End time must be after start time'); return; }
    setUnavailability([...unavailability, { id: Date.now().toString(), date, start_time, end_time, reason: reason.trim(), created_at: new Date().toISOString() }]);
    setNewUnavailable({ date: '', start_time: '', end_time: '', reason: '' });
    toast.success('Unavailability added');
  };

  const handleRemoveUnavailability = (slotId) => {
    setUnavailability(unavailability.filter(slot => slot.id !== slotId));
    toast.success('Unavailability removed');
  };

  const handleSaveAvailability = async () => {
    try {
      const response = await updateCA(selectedCA.id, { unavailable_slots: unavailability });
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
    }
  };

  const handleCloseAvailabilityModal = () => {
    setShowAvailabilityModal(false);
    setSelectedCA(null);
    setUnavailability([]);
    setNewUnavailable({ date: '', start_time: '', end_time: '', reason: '' });
  };

  /* ─── Shared input class ─── */
  const inputCls = (err) =>
    `w-full px-3 py-2.5 sm:px-4 text-sm sm:text-base border ${err ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed`;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center px-4">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-gray-200 border-t-gray-800 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-sm sm:text-base">Loading CA list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 pb-8">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8"
        >
          <div className="block sm:flex items-start xs:items-center justify-between gap-3 sm:gap-4">

            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="p-2 sm:p-3 bg-gray-900 rounded-xl flex-shrink-0">
                <svg className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">Chartered Accountants</h1>
                <p className="text-gray-500 text-xs sm:text-sm lg:text-base mt-0.5">Manage your professional CA team</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="w-full xs:w-auto sm:w-auto flex-shrink-0 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-all font-semibold flex items-center justify-center gap-2 text-sm sm:text-base touch-manipulation"
              style={{marginTop:10}}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New CA
            </button>
          </div>
        </motion.div>

        {/* ── Stats bar (tablet+) ── */}
        {caList.length > 0 && (
          <div className="hidden sm:grid grid-cols-3 gap-3 sm:gap-4">
            {[
              { label: 'Total CAs', value: caList.length, color: 'bg-gray-900 text-white' },
              { label: 'Active', value: caList.filter(c => c.status === 'active').length, color: 'bg-green-600 text-white' },
              { label: 'Inactive', value: caList.filter(c => c.status !== 'active').length, color: 'bg-amber-500 text-white' },
            ].map(stat => (
              <div key={stat.label} className={`${stat.color} rounded-xl p-4 flex items-center justify-between shadow-sm`}>
                <span className="text-sm font-medium opacity-80">{stat.label}</span>
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty State ── */}
        {caList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No CAs Added Yet</h3>
            <p className="text-gray-500 text-sm sm:text-base mb-5 sm:mb-6">Start building your team by adding your first Chartered Accountant</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-semibold inline-flex items-center gap-2 text-sm sm:text-base touch-manipulation"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Your First CA
            </button>
          </motion.div>
        ) : (
          /* ── CA Cards Grid — 1 col mobile · 2 tablet · 3 desktop ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {caList.map((ca, index) => (
              <motion.div
                key={ca.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden flex flex-col"
              >
                {/* Card Header */}
                <div className="border-b border-gray-100 p-4 sm:p-5 lg:p-6">
                  <div className="flex items-start justify-between mb-3">
                    {ca.profile_picture ? (
                      <img
                        src={ca.profile_picture}
                        alt={ca.name}
                        className="w-11 h-11 sm:w-13 sm:h-13 lg:w-14 lg:h-14 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                          {ca.name?.charAt(0)?.toUpperCase() || 'C'}
                        </span>
                      </div>
                    )}
                    <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                      ca.status === 'active'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {(ca.status?.toUpperCase() || 'ACTIVE')}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 leading-snug mb-0.5">{ca.name}</h3>
                  {ca.qualification && (
                    <p className="text-gray-500 text-xs sm:text-sm font-medium">{ca.qualification}</p>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 lg:p-6 flex-1">
                  {ca.intro && (
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                      {ca.intro}
                    </p>
                  )}
                  <div className="space-y-2 sm:space-y-3">
                    {[
                      { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", text: ca.email, truncate: true },
                      { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", text: ca.phone || ca.mobile },
                      { icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", text: ca.specialization },
                      { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", text: `${ca.experience || 0} years experience` },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center text-xs sm:text-sm text-gray-700 gap-2">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                        <span className={item.truncate ? 'truncate' : ''}>{item.text}</span>
                      </div>
                    ))}

                    {ca.unavailable_slots && Array.isArray(ca.unavailable_slots) && ca.unavailable_slots.length > 0 && (
                      <div className="flex items-center text-xs sm:text-sm text-amber-700 bg-amber-50 rounded-lg p-2 mt-1 border border-amber-200 gap-2">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">{ca.unavailable_slots.length} unavailable slot(s)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer — stacked on xs, row on sm+ */}
                <div className="px-4 sm:px-5 lg:px-6 pb-4 sm:pb-5 lg:pb-6 grid grid-cols-3 gap-1.5 sm:gap-2">
                  <button
                    onClick={() => handleEdit(ca)}
                    className="col-span-1 px-2 sm:px-3 py-2 sm:py-2.5 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors text-xs sm:text-sm font-semibold touch-manipulation text-center"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleManageAvailability(ca)}
                    className="col-span-1 px-2 sm:px-3 py-2 sm:py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-colors text-xs sm:text-sm font-semibold touch-manipulation text-center"
                  >
                    Schedule
                  </button>
                  <button
                    onClick={() => handleDelete(ca.id)}
                    className="col-span-1 px-2 sm:px-3 py-2 sm:py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 active:bg-red-200 transition-colors text-xs sm:text-sm font-semibold border border-red-200 touch-manipulation text-center"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ══════════════ CA Form Modal ══════════════ */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
              <motion.div
                initial={{ opacity: 0, y: '100%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-2xl lg:max-w-3xl max-h-[95vh] sm:max-h-[92vh] flex flex-col"
                style={{ maxHeight: 'calc(100dvh - env(safe-area-inset-top, 0px))' }}
              >
                {/* Modal Header */}
                <div className="border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
                  {/* Drag handle (mobile) */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-300 rounded-full sm:hidden" />
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                    {editingCA ? 'Edit CA Details' : 'Add New CA'}
                  </h2>
                  <button
                    onClick={handleModalClose}
                    disabled={submittingForm}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 disabled:opacity-50 touch-manipulation"
                    aria-label="Close modal"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">

                    {/* Profile Picture */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                        Profile Picture
                      </label>
                      <div className="flex items-center gap-3 sm:gap-4">
                        {imagePreview ? (
                          <div className="relative flex-shrink-0">
                            <img src={imagePreview} alt="Profile preview" className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full object-cover border-2 border-gray-200" />
                            <button type="button" onClick={handleRemoveImage} disabled={submittingForm}
                              className="absolute -top-1.5 -right-1.5 p-1 sm:p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 touch-manipulation">
                              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 flex-shrink-0">
                            <svg className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleImageChange} disabled={submittingForm} className="hidden" />
                          <button type="button" onClick={triggerFileInput} disabled={uploadingImage || submittingForm}
                            className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors text-xs sm:text-sm font-semibold disabled:opacity-50 touch-manipulation">
                            {uploadingImage ? 'Processing...' : 'Choose Image'}
                          </button>
                          <p className="text-xs text-gray-400 mt-1.5">JPEG, PNG, or WebP. Max 5MB.</p>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">

                      <div className="sm:col-span-2">
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Full Name <span className="text-red-500">*</span></label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          disabled={submittingForm} className={inputCls(formErrors.name)} placeholder="Enter full name" />
                        {formErrors.name && <p className="mt-1 text-xs sm:text-sm text-red-600">{formErrors.name}</p>}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Qualification</label>
                        <input type="text" value={formData.qualification} onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                          disabled={submittingForm} className={inputCls(false)} placeholder="e.g., CA, FCA, ACA" />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Email Address <span className="text-red-500">*</span></label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={submittingForm} className={inputCls(formErrors.email)} placeholder="email@example.com" />
                        {formErrors.email && <p className="mt-1 text-xs sm:text-sm text-red-600">{formErrors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Phone Number <span className="text-red-500">*</span></label>
                        <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          disabled={submittingForm} className={inputCls(formErrors.phone)} placeholder="10-digit phone number" maxLength="10" />
                        {formErrors.phone && <p className="mt-1 text-xs sm:text-sm text-red-600">{formErrors.phone}</p>}
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Specialization <span className="text-red-500">*</span></label>
                        <input type="text" value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                          disabled={submittingForm} className={inputCls(formErrors.specialization)} placeholder="e.g., Tax, Audit, Corporate" />
                        {formErrors.specialization && <p className="mt-1 text-xs sm:text-sm text-red-600">{formErrors.specialization}</p>}
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Experience (Years) <span className="text-red-500">*</span></label>
                        <input type="number" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          disabled={submittingForm} className={inputCls(formErrors.experience)} placeholder="Years of experience" min="0" />
                        {formErrors.experience && <p className="mt-1 text-xs sm:text-sm text-red-600">{formErrors.experience}</p>}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Professional Introduction</label>
                        <textarea value={formData.intro} onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
                          disabled={submittingForm}
                          className="w-full px-3 sm:px-4 py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="Brief professional introduction..." rows="3" />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Status</label>
                        <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          disabled={submittingForm} className={inputCls(false)}>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex gap-2 sm:gap-3 border-t border-gray-200 flex-shrink-0" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
                    <button type="button" onClick={handleModalClose} disabled={submittingForm}
                      className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm sm:text-base disabled:opacity-50 touch-manipulation">
                      Cancel
                    </button>
                    <button type="submit" disabled={uploadingImage || submittingForm}
                      className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-manipulation">
                      {submittingForm && (
                        <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      )}
                      <span className="truncate">
                        {submittingForm ? 'Saving...' : uploadingImage ? 'Processing...' : editingCA ? 'Update CA' : 'Add CA'}
                      </span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ══════════════ Availability Modal ══════════════ */}
        <AnimatePresence>
          {showAvailabilityModal && selectedCA && (
            <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
              <motion.div
                initial={{ opacity: 0, y: '100%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-2xl lg:max-w-4xl max-h-[95vh] sm:max-h-[92vh] flex flex-col"
                style={{ maxHeight: 'calc(100dvh - env(safe-area-inset-top, 0px))' }}
              >
                {/* Header */}
                <div className="border-b border-gray-200 px-4 sm:px-6 py-4 flex items-start justify-between flex-shrink-0">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-300 rounded-full sm:hidden" />
                  <div className="min-w-0 pr-3">
                    <h2 className="text-base sm:text-2xl font-bold text-gray-900">Manage Availability</h2>
                    <p className="text-gray-500 text-xs sm:text-sm mt-0.5 truncate">{selectedCA.name} — unavailable dates & times</p>
                  </div>
                  <button onClick={handleCloseAvailabilityModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 flex-shrink-0 touch-manipulation" aria-label="Close">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">

                  {/* Add Slot Form */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6">
                    <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Add Unavailable Time Slot</h3>
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Date <span className="text-red-500">*</span></label>
                        <input type="date" value={newUnavailable.date} onChange={(e) => setNewUnavailable({ ...newUnavailable, date: e.target.value })}
                          className={inputCls(false)} min={new Date().toISOString().split('T')[0]} />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Reason (Optional)</label>
                        <input type="text" value={newUnavailable.reason} onChange={(e) => setNewUnavailable({ ...newUnavailable, reason: e.target.value })}
                          className={inputCls(false)} placeholder="e.g., Personal leave" />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Start Time <span className="text-red-500">*</span></label>
                        <input type="time" value={newUnavailable.start_time} onChange={(e) => setNewUnavailable({ ...newUnavailable, start_time: e.target.value })}
                          className={inputCls(false)} />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">End Time <span className="text-red-500">*</span></label>
                        <input type="time" value={newUnavailable.end_time} onChange={(e) => setNewUnavailable({ ...newUnavailable, end_time: e.target.value })}
                          className={inputCls(false)} />
                      </div>
                    </div>
                    <button onClick={handleAddUnavailability}
                      className="mt-3 sm:mt-4 w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-semibold flex items-center justify-center gap-2 text-sm sm:text-base touch-manipulation">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Slot
                    </button>
                  </div>

                  {/* Slots List */}
                  <div>
                    <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                      Unavailable Slots ({unavailability.length})
                    </h3>
                    {unavailability.length === 0 ? (
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 sm:p-8 text-center">
                        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-500 font-medium text-sm sm:text-base">No unavailable slots set</p>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1">This CA is available at all times</p>
                      </div>
                    ) : (
                      <div className="space-y-2 sm:space-y-3">
                        <AnimatePresence>
                          {unavailability.map((slot) => (
                            <motion.div key={slot.id}
                              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                              className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-sm transition-all">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2 flex-wrap">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-bold text-gray-900 text-xs sm:text-base">
                                      {new Date(slot.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-gray-600 mb-0.5">
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="font-semibold text-xs sm:text-sm">{slot.start_time} – {slot.end_time}</span>
                                  </div>
                                  {slot.reason && (
                                    <p className="text-xs sm:text-sm text-gray-500 ml-5 italic">{slot.reason}</p>
                                  )}
                                </div>
                                <button onClick={() => handleRemoveUnavailability(slot.id)}
                                  className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 touch-manipulation" title="Remove">
                                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex gap-2 sm:gap-3 border-t border-gray-200 flex-shrink-0" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
                  <button onClick={handleCloseAvailabilityModal}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm sm:text-base touch-manipulation">
                    Cancel
                  </button>
                  <button onClick={handleSaveAvailability}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold text-sm sm:text-base touch-manipulation">
                    Save Changes
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