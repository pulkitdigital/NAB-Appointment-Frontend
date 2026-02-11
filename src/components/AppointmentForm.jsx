import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCAList } from '../services/api';

const AppointmentForm = ({ formData, onChange, errors = {} }) => {
  const [caList, setCAList] = useState([]);
  const [loadingCAs, setLoadingCAs] = useState(true);

  useEffect(() => {
    fetchCAs();
  }, []);

  const fetchCAs = async () => {
    try {
      const response = await getCAList();
      console.log('📋 CA List Response:', response);
      
      if (response.success) {
        const activeCAs = (response.data.cas || response.data || []).filter(ca => ca.status === 'active');
        console.log('✅ Active CAs:', activeCAs);
        setCAList(activeCAs);
      } else {
        console.error('❌ Failed to fetch CAs:', response);
      }
    } catch (error) {
      console.error('❌ Failed to fetch CA list:', error);
    } finally {
      setLoadingCAs(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
    
    if (name === 'ca_id') {
      onChange({ ...formData, [name]: value, time_slot: '' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Your Information</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            placeholder="Enter your full name"
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none`}
            required
          />
          {errors.name && (
            <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="mobile" className="block text-sm font-semibold text-gray-700 mb-2">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            value={formData.mobile || ''}
            onChange={handleChange}
            placeholder="10-digit mobile number"
            maxLength="10"
            pattern="[0-9]{10}"
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.mobile ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none`}
            required
          />
          {errors.mobile && (
            <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.mobile}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            placeholder="your.email@example.com"
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none`}
            required
          />
          {errors.email && (
            <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="ca_id" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Select Chartered Accountant <span className="text-red-500">*</span>
          </label>
          {loadingCAs ? (
            <div className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-400 flex items-center gap-2">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-900"></div>
              Loading CAs...
            </div>
          ) : (
            <>
              <div className="relative">
                <select
                  id="ca_id"
                  name="ca_id"
                  value={formData.ca_id || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.ca_id ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none appearance-none cursor-pointer bg-white`}
                  required
                >
                  <option value="" disabled>Select a CA</option>
                  {caList.length > 0 ? (
                    caList.map((ca) => (
                      <option key={ca.id} value={ca.id}>
                        {ca.name} - {ca.specialization} ({ca.experience} years exp.)
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No CAs available</option>
                  )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {caList.length === 0 && !loadingCAs && (
                <p className="mt-2 text-sm text-amber-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  No CAs available at the moment
                </p>
              )}
              {formData.ca_id && (
                <p className="mt-2 text-xs text-gray-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Time slots will show availability for selected CA
                </p>
              )}
            </>
          )}
          {errors.ca_id && (
            <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.ca_id}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="consult_note" className="block text-sm font-semibold text-gray-700 mb-2">
            Consultation Details <span className="text-red-500">*</span>
          </label>
          <textarea
            id="consult_note"
            name="consult_note"
            value={formData.consult_note || ''}
            onChange={handleChange}
            placeholder="Brief description of what you'd like to discuss..."
            rows="4"
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.consult_note ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none resize-none`}
            required
          />
          {errors.consult_note && (
            <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.consult_note}
            </p>
          )}
          <p className="mt-1.5 text-xs text-gray-500">Minimum 10 characters required</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AppointmentForm;