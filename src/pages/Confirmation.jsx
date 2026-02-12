import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { getBookingById } from '../services/api';

const Confirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await getBookingById(bookingId);
      if (response.success) {
        setBooking(response.data);
        console.log('📋 Booking data:', response.data); // Debug
      } else {
        setError('Booking not found');
      }
    } catch (err) {
      setError('Failed to load booking details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Helper — Firestore ke customer_name / name dono handle karo
  const getName    = (b) => b.customer_name    || b.name    || '—';
  const getEmail   = (b) => b.customer_email   || b.email   || '—';
  const getPhone   = (b) => b.customer_phone   || b.mobile  || b.phone || '—';
  const getNote    = (b) => b.consult_note     || b.notes   || '';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-800 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/appointment')}
            className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
          >
            Book New Appointment
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        {/* Success Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-200"
            >
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-gray-600 text-lg">
              Your consultation has been successfully scheduled
            </p>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900">Appointment Details</h2>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-start">
              <div className="w-40 text-sm text-gray-600 font-medium">Reference ID:</div>
              <div className="flex-1 font-mono font-bold text-gray-900">
                {booking.reference_id || bookingId}
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-40 text-sm text-gray-600 font-medium">Date:</div>
              <div className="flex-1 font-semibold text-gray-900">
                {booking.date ? format(new Date(booking.date), 'EEEE, MMMM d, yyyy') : '—'}
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-40 text-sm text-gray-600 font-medium">Time:</div>
              <div className="flex-1 font-semibold text-gray-900">
                {booking.time_slot || '—'}
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-40 text-sm text-gray-600 font-medium">Duration:</div>
              <div className="flex-1 font-semibold text-gray-900">
                {booking.duration || 30} minutes
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-40 text-sm text-gray-600 font-medium">Status:</div>
              <div className="flex-1">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-200">
                  Confirmed
                </span>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-40 text-sm text-gray-600 font-medium">Amount Paid:</div>
              <div className="flex-1 font-bold text-gray-900">
                ₹{booking.amount || 0}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Your Information — Fixed field names */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900">Your Information</h2>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-start">
              <div className="w-40 text-sm text-gray-600 font-medium">Name:</div>
              <div className="flex-1 font-semibold text-gray-900">
                {getName(booking)}
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-40 text-sm text-gray-600 font-medium">Mobile:</div>
              <div className="flex-1 font-semibold text-gray-900">
                {getPhone(booking)}
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-40 text-sm text-gray-600 font-medium">Email:</div>
              <div className="flex-1 font-semibold text-gray-900">
                {getEmail(booking)}
              </div>
            </div>

            {getNote(booking) && (
              <div className="flex items-start">
                <div className="w-40 text-sm text-gray-600 font-medium">Notes:</div>
                <div className="flex-1 text-gray-700">{getNote(booking)}</div>
              </div>
            )}
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2">What's Next?</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>A confirmation email has been sent to {getEmail(booking)}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>Please join the consultation 5 minutes before the scheduled time</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>Save your reference ID for future correspondence</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>You will receive a reminder 24 hours before your appointment</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Details
            </button>

            <button
              onClick={() => navigate('/appointment')}
              className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              Book Another Appointment
            </button>
          </div>
        </div>

        {/* Support */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Need to reschedule or have questions?{' '}
            <a href="mailto:support@example.com" className="text-gray-900 hover:underline font-semibold">
              Contact Support
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Confirmation;