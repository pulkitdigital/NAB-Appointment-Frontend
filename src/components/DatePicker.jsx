import { useState, useEffect } from 'react';
import { format, addDays, startOfDay, isSameDay, isBefore } from 'date-fns';
import { motion } from 'framer-motion';
import { getPublicSettings } from '../services/api';

const DatePicker = ({ selectedDate, onDateChange }) => {
  const today = startOfDay(new Date());
  const [displayMonth, setDisplayMonth] = useState(today);
  const [offDays, setOffDays] = useState([]);
  const [weeklySchedule, setWeeklySchedule] = useState({});
  const [advanceBookingDays, setAdvanceBookingDays] = useState(15);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffDays();
  }, []);

  const fetchOffDays = async () => {
    setLoading(true);
    try {
      const response = await getPublicSettings();
      if (response.success) {
        console.log('✅ Settings loaded in DatePicker:', response.data);
        setOffDays(response.data.off_days || []);
        setWeeklySchedule(response.data.weekly_schedule || {});
        setAdvanceBookingDays(response.data.advance_booking_days || 15);
      } else {
        console.error('❌ Failed to load settings:', response.message);
      }
    } catch (error) {
      console.error('❌ Failed to fetch settings:', error);
      setOffDays([]);
      setWeeklySchedule({});
    } finally {
      setLoading(false);
    }
  };

  const availableDates = Array.from({ length: advanceBookingDays }, (_, i) => addDays(today, i));

  const isDayOff = (date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    if (offDays.includes(dateString)) {
      return true;
    }

    const dayName = format(date, 'EEEE').toLowerCase();
    if (weeklySchedule[dayName] && !weeklySchedule[dayName].enabled) {
      return true;
    }

    return false;
  };

  const handleDateClick = (date) => {
    if (!isDayOff(date)) {
      onDateChange(date);
    }
  };

  const getCalendarDates = () => {
    if (availableDates.length === 0) return [];
    
    const firstDate = availableDates[0];
    const lastDate = availableDates[availableDates.length - 1];
    
    const dayOfWeek = firstDate.getDay();
    const calendarStart = addDays(firstDate, -dayOfWeek);
    
    const lastDayOfWeek = lastDate.getDay();
    const calendarEnd = addDays(lastDate, 6 - lastDayOfWeek);
    
    const totalDays = Math.ceil((calendarEnd - calendarStart) / (1000 * 60 * 60 * 24)) + 1;
    
    const dates = [];
    for (let i = 0; i < totalDays; i++) {
      const date = addDays(calendarStart, i);
      dates.push(date);
    }
    
    console.log(`📅 Calendar showing ${totalDays} days (${Math.ceil(totalDays / 7)} weeks)`);
    return dates;
  };

  const calendarDates = getCalendarDates();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Select Date
          </h3>
          <p className="text-sm text-gray-600 mt-1">Choose your preferred appointment date</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 font-medium">Available Days</p>
          <p className="text-2xl font-bold text-gray-900">{advanceBookingDays}</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-900"></div>
          <p className="mt-2 text-gray-600 font-medium">Loading calendar...</p>
        </div>
      ) : (
        <>
          {/* Day Headers */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-7 gap-2 mb-3">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center">
                  <span className="text-xs font-bold text-gray-700 uppercase">{day}</span>
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 max-h-96 overflow-y-auto custom-scrollbar">
              {calendarDates.map((date, index) => {
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                const isInRange = availableDates.some(d => isSameDay(d, date));
                const isOff = isDayOff(date);
                const isPast = isBefore(date, today);
                const isDisabled = !isInRange || isOff || isPast;

                return (
                  <motion.button
                    key={index}
                    whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                    onClick={() => !isDisabled && handleDateClick(date)}
                    disabled={isDisabled}
                    className={`
                      relative p-3 rounded-lg text-center transition-all font-semibold
                      ${isSelected 
                        ? 'bg-gray-900 text-white shadow-md' 
                        : isDisabled
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : isOff
                        ? 'bg-red-50 text-red-400 border border-red-200 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                      }
                    `}
                  >
                    {isOff && isInRange && !isPast && (
                      <div className="absolute top-0.5 right-0.5">
                        <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <div className="text-base font-bold">{format(date, 'd')}</div>
                    <div className="text-[10px] uppercase mt-0.5">{format(date, 'MMM')}</div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
              <span className="text-xs font-semibold text-gray-700">Available</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="w-4 h-4 bg-gray-900 rounded"></div>
              <span className="text-xs font-semibold text-gray-700">Selected</span>
            </div>
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="w-4 h-4 bg-red-50 border border-red-200 rounded relative">
                <svg className="w-3 h-3 text-red-500 absolute inset-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-gray-700">Off Day</span>
            </div>
          </div>

          {/* Selected Date Display */}
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-lg p-5"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-600 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-green-700 uppercase">Selected Date</p>
                  <p className="text-lg font-bold text-green-900">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Info Box */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Booking Information</p>
                <p className="text-xs text-gray-600 mt-1">
                  You can book appointments up to {advanceBookingDays} days in advance. Dates marked with ⊘ are holidays or off days.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default DatePicker;