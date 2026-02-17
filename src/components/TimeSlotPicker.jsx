import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, isSameDay } from 'date-fns';
import { getAvailableSlots, getPublicSettings } from '../services/api';

const TimeSlotPicker = ({ selectedDate, selectedSlot, onSlotChange, selectedCA = null }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [caUnavailableSlots, setCAUnavailableSlots] = useState([]);
  const [weeklySchedule, setWeeklySchedule] = useState({});
  const [settingsLoading, setSettingsLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots();
    }
  }, [selectedDate, selectedCA]);

  const fetchSettings = async () => {
    setSettingsLoading(true);
    try {
      const response = await getPublicSettings();
      if (response.success) {
        console.log('✅ Settings loaded in TimeSlotPicker:', response.data);
        setWeeklySchedule(response.data.weekly_schedule || {});
      } else {
        console.error('❌ Failed to load settings:', response.message);
      }
    } catch (error) {
      console.error('❌ Failed to fetch settings:', error);
    } finally {
      setSettingsLoading(false);
    }
  };

  const fetchBookedSlots = async () => {
    setLoading(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const response = await getAvailableSlots(dateStr, selectedCA);
      
      if (response.success) {
        console.log('📅 Booked appointments for', dateStr, ':', response.data.appointments);
        console.log('🔍 Total booked appointments:', response.data.appointments?.length || 0);
        
        response.data.appointments?.forEach((apt, idx) => {
          console.log(`📌 Appointment ${idx + 1}:`, {
            time: apt.time_slot,
            duration: apt.duration,
            status: apt.status,
            assigned_ca: apt.assigned_ca,
            ca_name: apt.ca_name
          });
        });
        
        setBookedAppointments(response.data.appointments || []);
        
        const unavailable = response.data.ca_unavailable_slots || [];
        setCAUnavailableSlots(unavailable);
        
        if (unavailable.length > 0) {
          console.log('✅ Found unavailable slots:', unavailable);
        }
      } else {
        console.error('❌ Failed to fetch slots:', response.message);
        setBookedAppointments([]);
        setCAUnavailableSlots([]);
      }
    } catch (error) {
      console.error('❌ Failed to fetch booked slots:', error);
      setBookedAppointments([]);
      setCAUnavailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const isSlotBlockedByCAUnavailability = (slotTime) => {
    if (!selectedCA || caUnavailableSlots.length === 0) {
      return false;
    }

    const [slotHour, slotMinute] = slotTime.split(':').map(Number);
    const slotStartMinutes = slotHour * 60 + slotMinute;
    const slotEndMinutes = slotStartMinutes + 30;

    return caUnavailableSlots.some(unavailableSlot => {
      const [startHour, startMinute] = unavailableSlot.start_time.split(':').map(Number);
      const [endHour, endMinute] = unavailableSlot.end_time.split(':').map(Number);
      
      const unavailableStartMinutes = startHour * 60 + startMinute;
      const unavailableEndMinutes = endHour * 60 + endMinute;

      const overlaps = slotStartMinutes < unavailableEndMinutes && slotEndMinutes > unavailableStartMinutes;
      
      if (overlaps) {
        console.log(`✗ Slot ${slotTime} is BLOCKED by CA unavailability`);
      }
      
      return overlaps;
    });
  };

  const isSlotInPast = (slotTime) => {
    const today = new Date();
    const isToday = isSameDay(selectedDate, today);
    
    if (!isToday) {
      return false;
    }

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [slotHour, slotMinute] = slotTime.split(':').map(Number);
    const slotMinutes = slotHour * 60 + slotMinute;

    const isPast = slotMinutes <= currentMinutes;
    
    if (isPast) {
      console.log(`⏰ Slot ${slotTime} is in the PAST (current time: ${now.getHours()}:${now.getMinutes()})`);
    }
    
    return isPast;
  };

  const isSlotBooked = (slotTime) => {
    console.log(`\n🔍 Checking if slot ${slotTime} is booked...`);
    console.log(`   Selected CA: ${selectedCA || 'None'}`);
    console.log(`   Total appointments to check: ${bookedAppointments.length}`);

    if (!selectedDate || bookedAppointments.length === 0) {
      console.log(`   ✓ Slot ${slotTime} is AVAILABLE (no appointments)`);
      return false;
    }

    const [slotHour, slotMinute] = slotTime.split(':').map(Number);
    const slotStartMinutes = slotHour * 60 + slotMinute;
    const slotEndMinutes = slotStartMinutes + 30;

    console.log(`   Slot time range: ${slotStartMinutes}-${slotEndMinutes} minutes`);

    const isBooked = bookedAppointments.some((appointment, idx) => {
      console.log(`\n   📋 Checking appointment ${idx + 1}:`, {
        time_slot: appointment.time_slot,
        duration: appointment.duration,
        status: appointment.status,
        assigned_ca: appointment.assigned_ca,
        ca_name: appointment.ca_name
      });

      const isSameCA = selectedCA 
        ? (appointment.assigned_ca && appointment.assigned_ca.toString() === selectedCA.toString())
        : true;
      
      console.log(`      CA match check: ${isSameCA} (selectedCA: ${selectedCA}, appointment CA: ${appointment.assigned_ca})`);

      if (!isSameCA) {
        console.log(`      ⏭️  Skipping - Different CA`);
        return false;
      }

      const validStatus = !appointment.status || ['pending', 'confirmed'].includes(appointment.status);
      
      if (!validStatus) {
        console.log(`      ⏭️  Skipping - Status is ${appointment.status}`);
        return false;
      }

      const [existingHour, existingMinute] = appointment.time_slot.split(':').map(Number);
      const existingStart = existingHour * 60 + existingMinute;
      const existingEnd = existingStart + (appointment.duration || 30);

      console.log(`      Appointment time range: ${existingStart}-${existingEnd} minutes`);

      const overlaps = slotStartMinutes < existingEnd && slotEndMinutes > existingStart;
      
      console.log(`      Overlap check: ${overlaps}`);
      
      if (overlaps) {
        console.log(`      ❌ BLOCKED - Slot ${slotTime} overlaps with appointment at ${appointment.time_slot}`);
      }
      
      return overlaps;
    });

    if (isBooked) {
      console.log(`   ❌ Final result: Slot ${slotTime} is BOOKED`);
    } else {
      console.log(`   ✓ Final result: Slot ${slotTime} is AVAILABLE`);
    }

    return isBooked;
  };

  useEffect(() => {
    if (!selectedDate || settingsLoading) {
      setSlots([]);
      return;
    }

    const generateSlots = () => {
      console.log('\n🎯 Generating slots...');
      console.log('Selected CA:', selectedCA);
      console.log('Booked appointments:', bookedAppointments.length);
      
      const timeSlots = [];
      
      const dayOfWeek = format(selectedDate, 'EEEE').toLowerCase();
      const daySchedule = weeklySchedule?.[dayOfWeek];
      
      if (!daySchedule || !daySchedule.enabled) {
        console.log('❌ Day is not enabled in schedule');
        return [];
      }
      
      const [startHour, startMinute] = daySchedule.start.split(':').map(Number);
      const [endHour, endMinute] = daySchedule.end.split(':').map(Number);
      
      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;

      for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
        const hour = Math.floor(minutes / 60);
        const minute = minutes % 60;
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        const isPast = isSlotInPast(time);
        const isBooked = isSlotBooked(time);
        const isCAUnavailable = isSlotBlockedByCAUnavailability(time);
        
        timeSlots.push({
          time,
          display: format(new Date(`2000-01-01T${time}`), 'h:mm a'),
          isPast: isPast,
          isBooked: isBooked,
          isCAUnavailable: isCAUnavailable,
          isDisabled: isPast || isBooked || isCAUnavailable,
        });
      }
      
      console.log(`✅ Generated ${timeSlots.length} slots`);
      console.log('Past slots:', timeSlots.filter(s => s.isPast).map(s => s.time));
      console.log('Booked slots:', timeSlots.filter(s => s.isBooked).map(s => s.time));
      console.log('CA unavailable slots:', timeSlots.filter(s => s.isCAUnavailable).map(s => s.time));
      
      return timeSlots;
    };

    setSlots(generateSlots());
  }, [selectedDate, bookedAppointments, caUnavailableSlots, selectedCA, weeklySchedule, settingsLoading]);

  if (!selectedDate) {
    return (
      <div className="text-center py-8 sm:py-12 bg-gray-50 border border-gray-200 rounded-lg">
        <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-2 sm:mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm sm:text-base text-gray-500 font-semibold">Please select a date first</p>
      </div>
    );
  }

  if (loading || settingsLoading) {
    return (
      <div className="text-center py-6 sm:py-8">
        <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-gray-200 border-t-gray-900"></div>
        <p className="mt-2 text-sm sm:text-base text-gray-600 font-medium">Loading available slots...</p>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 bg-gray-50 border border-gray-200 rounded-lg">
        <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-2 sm:mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm sm:text-base text-gray-500 font-semibold">No slots available for this date</p>
        <p className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2">This day might be closed or fully booked</p>
      </div>
    );
  }

  const availableSlots = slots.filter(s => !s.isDisabled);
  const bookedSlotsCount = slots.filter(s => s.isBooked).length;
  const unavailableSlotsCount = slots.filter(s => s.isCAUnavailable).length;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-1.5 sm:gap-2">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="truncate">Select Time Slot</span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 line-clamp-2">
            {selectedCA 
              ? 'Available slots for selected CA' 
              : 'Choose your preferred appointment time'}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Available</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">{availableSlots.length}/{slots.length}</p>
        </div>
      </div>
      
      {/* Slots Grid */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
          {slots.map((slot, index) => {
            const isSelected = selectedSlot === slot.time;
            const isDisabled = slot.isDisabled;

            let disabledReason = '';
            let bgColor = '';
            let borderColor = '';
            
            if (slot.isPast) {
              disabledReason = 'Past';
              bgColor = 'bg-gray-100';
              borderColor = 'border-gray-300';
            } else if (slot.isBooked) {
              disabledReason = 'Booked';
              bgColor = 'bg-red-50';
              borderColor = 'border-red-200';
            } else if (slot.isCAUnavailable) {
              disabledReason = 'CA Off';
              bgColor = 'bg-orange-50';
              borderColor = 'border-orange-200';
            } else {
              bgColor = 'bg-white';
              borderColor = 'border-gray-300';
            }

            return (
              <motion.button
                key={slot.time}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.01 }}
                whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                onClick={() => !isDisabled && onSlotChange(slot.time)}
                disabled={isDisabled}
                className={`
                  relative p-2 sm:p-2.5 md:p-3 rounded-lg text-center transition-all font-semibold border
                  ${isSelected 
                    ? 'bg-gray-900 text-white shadow-md' 
                    : isDisabled
                    ? `${bgColor} ${borderColor} text-gray-400 cursor-not-allowed`
                    : `${bgColor} ${borderColor} text-gray-700 hover:border-gray-400 hover:bg-gray-50 active:bg-gray-100`
                  }
                `}
              >
                {isDisabled && (
                  <div className="absolute top-0.5 right-0.5">
                    <svg 
                      className={`w-2 h-2 sm:w-3 sm:h-3 ${
                        slot.isPast ? 'text-gray-400' : 
                        slot.isBooked ? 'text-red-500' : 
                        'text-orange-500'
                      }`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div className="text-[10px] sm:text-xs md:text-sm font-bold">{slot.display}</div>
                {isDisabled && (
                  <div className={`text-[8px] sm:text-[10px] mt-0.5 sm:mt-1 font-semibold uppercase ${
                    slot.isPast ? 'text-gray-500' :
                    slot.isBooked ? 'text-red-500' : 
                    'text-orange-500'
                  }`}>
                    {disabledReason}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-50 border border-gray-200 rounded-lg p-2 sm:p-3">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white border border-gray-300 rounded flex-shrink-0"></div>
          <span className="text-[10px] sm:text-xs font-semibold text-gray-700 truncate">Available ({availableSlots.length})</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 bg-red-50 border border-red-200 rounded-lg p-2 sm:p-3">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-50 border border-red-200 rounded relative flex-shrink-0">
            <svg className="w-2 h-2 sm:w-3 sm:h-3 text-red-500 absolute inset-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-[10px] sm:text-xs font-semibold text-gray-700 truncate">Booked ({bookedSlotsCount})</span>
        </div>
        {selectedCA && (
          <div className="flex items-center gap-1.5 sm:gap-2 bg-orange-50 border border-orange-200 rounded-lg p-2 sm:p-3">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-50 border border-orange-200 rounded relative flex-shrink-0">
              <svg className="w-2 h-2 sm:w-3 sm:h-3 text-orange-500 absolute inset-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-gray-700 truncate">CA Off ({unavailableSlotsCount})</span>
          </div>
        )}
      </div>

      {/* Selected Slot Display */}
      {selectedSlot && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 md:p-5"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-green-600 rounded-lg flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs font-semibold text-green-700 uppercase">Selected Time</p>
              <p className="text-sm sm:text-base md:text-lg font-bold text-green-900">
                {slots.find(s => s.time === selectedSlot)?.display}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Info Box */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="flex-shrink-0">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-semibold text-gray-900">Slot Information</p>
            <p className="text-[10px] sm:text-xs text-gray-600 mt-1">
              Each time slot is 30 minutes. Gray slots have passed, red slots are booked{selectedCA && ', orange slots are when the selected CA is unavailable'}. Longer appointments will block multiple consecutive slots.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotPicker;