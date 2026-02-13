import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

import AppointmentForm from '../components/AppointmentForm';
import DatePicker from '../components/DatePicker';
import TimeSlotPicker from '../components/TimeSlotPicker';
import PayButton from '../components/PayButton';

import { getSettings, createBooking, verifyPayment } from '../services/api';
import { initiatePayment } from '../services/payment';

const Book = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ✅ URL se ca_id seedha nikalo — yahi prop mein jaayega
  const caIdFromURL = searchParams.get('ca_id') || '';

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    consult_note: '',
    ca_id: '',
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [slotDurations, setSlotDurations] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoadingSettings(true);
    try {
      const response = await getSettings();
      if (response.success) {
        const durations = response.data.slot_durations || [];
        setSlotDurations(durations);
        if (durations.length > 0) {
          setSelectedDuration(durations[0]);
        }
      } else {
        toast.error('Failed to load settings');
      }
    } catch (error) {
      toast.error('Failed to load settings');
      console.error('Settings fetch error:', error);
    } finally {
      setLoadingSettings(false);
    }
  };

  const handleFormChange = (newFormData) => {
    if (newFormData.ca_id !== formData.ca_id) {
      setSelectedSlot(null);
    }
    setFormData(newFormData);

    const changedField = Object.keys(newFormData).find(
      key => newFormData[key] !== formData[key]
    );
    if (changedField && errors[changedField]) {
      setErrors({ ...errors, [changedField]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.ca_id) {
      newErrors.ca_id = 'Please select a Chartered Accountant';
      toast.error('Please select a CA to continue');
    }

    if (!formData.consult_note.trim()) {
      newErrors.consult_note = 'Consultation details are required';
    } else if (formData.consult_note.trim().length < 10) {
      newErrors.consult_note = 'Please provide at least 10 characters';
    }

    if (!selectedDate) {
      toast.error('Please select a date');
      return false;
    }

    if (!selectedSlot) {
      toast.error('Please select a time slot');
      return false;
    }

    if (!selectedDuration) {
      toast.error('Please select a duration');
      return false;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fill all required fields correctly');
      return false;
    }

    return true;
  };

  const handlePayAndBook = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const bookingData = {
        customer_name: formData.name.trim(),
        customer_email: formData.email.trim(),
        customer_phone: formData.mobile.trim(),
        consult_note: formData.consult_note.trim(),
        ca_id: formData.ca_id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time_slot: selectedSlot,
        duration: selectedDuration.duration,
      };

      console.log('📤 Sending booking data:', bookingData);

      const response = await createBooking(bookingData);

      if (!response.success) {
        throw new Error(response.message || 'Failed to create booking');
      }

      const orderData = response.data;

      initiatePayment(
        {
          id: orderData.order_id,
          amount: orderData.amount,
          currency: orderData.currency,
        },
        {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile,
        },
        async (paymentResponse) => {
          try {
            const verifyData = {
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              appointment_id: orderData.appointment_id,
            };

            const verifyResult = await verifyPayment(verifyData);

            if (verifyResult.success) {
              toast.success('🎉 Booking confirmed!');
              setTimeout(() => {
                navigate(`/confirmation/${verifyResult.data.appointment_id}`);
              }, 1000);
            } else {
              toast.error('Payment verification failed');
              setLoading(false);
            }
          } catch (error) {
            toast.error('Payment verification failed');
            console.error('❌ Verification error:', error);
            setLoading(false);
          }
        },
        (errorMessage) => {
          toast.error(errorMessage || 'Payment failed');
          setLoading(false);
        }
      );
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to process booking';
      toast.error(errorMsg);
      console.error('❌ Booking error:', error.response?.data || error);
      setLoading(false);
    }
  };

  const isFormComplete = () => {
    return (
      formData.name.trim() &&
      formData.mobile.trim() &&
      formData.email.trim() &&
      formData.ca_id &&
      formData.consult_note.trim() &&
      selectedDate &&
      selectedSlot &&
      selectedDuration
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#363636',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gray-900 rounded-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Schedule Your Appointment
              </h1>
              <p className="text-gray-600 text-sm md:text-base mt-1">
                Expert Chartered Accountants ready to help you
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Two Column Layout */}
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6">

          {/* LEFT — Calendar & Time */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Date Picker */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <DatePicker
                selectedDate={selectedDate}
                onDateChange={(date) => {
                  setSelectedDate(date);
                  setSelectedSlot(null);
                }}
              />
            </div>

            {/* Duration Selection */}
            {selectedDate && formData.ca_id && slotDurations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-bold text-gray-900">Select Duration</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {slotDurations.map((duration) => (
                    <motion.button
                      key={duration.duration}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedDuration(duration);
                        setSelectedSlot(null);
                      }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedDuration?.duration === duration.duration
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <svg className={`w-5 h-5 ${selectedDuration?.duration === duration.duration ? 'text-gray-900' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {selectedDuration?.duration === duration.duration && (
                          <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </motion.svg>
                        )}
                      </div>
                      <div className="text-left">
                        <div className="text-lg font-bold text-gray-900">{duration.duration} min</div>
                        <div className="text-2xl font-bold text-gray-900">₹{duration.price}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CA not selected warning */}
            {selectedDate && !formData.ca_id && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 border border-amber-200 rounded-xl p-6"
              >
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-amber-900 mb-1">CA Selection Required</p>
                    <p className="text-sm text-amber-700">Please select a Chartered Accountant from the form to view available time slots</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Time Slot Picker */}
            {selectedDate && selectedDuration && formData.ca_id && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <TimeSlotPicker
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                  onSlotChange={setSelectedSlot}
                  selectedCA={formData.ca_id}
                />
              </motion.div>
            )}
          </motion.div>

          {/* RIGHT — Form & Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:sticky lg:top-8 hover:shadow-md transition-shadow">

              {/* ✅ preSelectedCAId prop pass ho raha hai */}
              <AppointmentForm
                formData={formData}
                onChange={handleFormChange}
                errors={errors}
                preSelectedCAId={caIdFromURL}
              />

              {/* Booking Summary */}
              {isFormComplete() && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 pt-6 border-t border-gray-200"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Booking Summary
                  </h3>

                  <div className="bg-gray-50 rounded-xl p-5 space-y-3 border border-gray-200">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <span className="text-sm text-gray-600 flex items-center gap-2 font-medium">
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Date
                      </span>
                      <span className="font-bold text-gray-900">{format(selectedDate, 'EEE, MMM d, yyyy')}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <span className="text-sm text-gray-600 flex items-center gap-2 font-medium">
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Time
                      </span>
                      <span className="font-bold text-gray-900">{format(new Date(`2000-01-01T${selectedSlot}`), 'h:mm a')}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <span className="text-sm text-gray-600 flex items-center gap-2 font-medium">
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Duration
                      </span>
                      <span className="font-bold text-gray-900">{selectedDuration.duration} minutes</span>
                    </div>

                    <div className="pt-3 border-t border-gray-300">
                      <div className="flex items-center justify-between p-4 bg-gray-900 rounded-xl">
                        <span className="text-base font-semibold text-white">Total Amount</span>
                        <span className="text-3xl font-bold text-white">₹{selectedDuration.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <PayButton
                      onClick={handlePayAndBook}
                      disabled={loading || loadingSettings}
                      loading={loading}
                      amount={selectedDuration.price}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Secure payment powered by Razorpay</span>
                  </div>
                </motion.div>
              )}

              {/* Progress Guide */}
              {!isFormComplete() && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 pt-6 border-t border-gray-200"
                >
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-gray-700 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-3">Complete these steps to book:</h4>
                        <ul className="space-y-2">
                          <li className={`flex items-center gap-2 text-sm ${formData.name && formData.email && formData.mobile && formData.ca_id && formData.consult_note ? 'text-green-700' : 'text-gray-700'}`}>
                            {formData.name && formData.email && formData.mobile && formData.ca_id && formData.consult_note ? (
                              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 text-gray-900 text-xs font-bold flex-shrink-0">1</span>
                            )}
                            <span className={formData.name && formData.email && formData.mobile && formData.ca_id && formData.consult_note ? 'line-through' : 'font-medium'}>
                              Fill in all contact details & select CA
                            </span>
                          </li>
                          <li className={`flex items-center gap-2 text-sm ${selectedDate ? 'text-green-700' : 'text-gray-700'}`}>
                            {selectedDate ? (
                              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 text-gray-900 text-xs font-bold flex-shrink-0">2</span>
                            )}
                            <span className={selectedDate ? 'line-through' : 'font-medium'}>Select a date from the calendar</span>
                          </li>
                          <li className={`flex items-center gap-2 text-sm ${selectedDuration ? 'text-green-700' : 'text-gray-700'}`}>
                            {selectedDuration ? (
                              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 text-gray-900 text-xs font-bold flex-shrink-0">3</span>
                            )}
                            <span className={selectedDuration ? 'line-through' : 'font-medium'}>Choose consultation duration</span>
                          </li>
                          <li className={`flex items-center gap-2 text-sm ${selectedSlot ? 'text-green-700' : 'text-gray-700'}`}>
                            {selectedSlot ? (
                              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 text-gray-900 text-xs font-bold flex-shrink-0">4</span>
                            )}
                            <span className={selectedSlot ? 'line-through' : 'font-medium'}>Pick an available time slot</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Book;