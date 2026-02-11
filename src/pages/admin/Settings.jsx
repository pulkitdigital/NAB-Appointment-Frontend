import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getSettings, updateSettings, addOffDay, removeOffDay } from '../../services/api';

const Settings = () => {
  const [settings, setSettings] = useState({
    business_name: '',
    business_address: '',
    advance_booking_days: 15,
    slot_durations: [
      { duration: 30, price: 500 },
      { duration: 60, price: 1000 }
    ],
    weekly_schedule: {
      monday: { enabled: true, start: '09:00', end: '18:00' },
      tuesday: { enabled: true, start: '09:00', end: '18:00' },
      wednesday: { enabled: true, start: '09:00', end: '18:00' },
      thursday: { enabled: true, start: '09:00', end: '18:00' },
      friday: { enabled: true, start: '09:00', end: '18:00' },
      saturday: { enabled: true, start: '09:00', end: '14:00' },
      sunday: { enabled: false, start: '09:00', end: '18:00' },
    },
    off_days: [],
    email_notifications: true,
    sms_notifications: false,
    reminder_hours: 24,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newOffDay, setNewOffDay] = useState('');

  const daysOfWeek = [
    { key: 'monday', label: 'Monday ' },
    { key: 'tuesday', label: 'Tuesday ' },
    { key: 'wednesday', label: 'Wednesday ' },
    { key: 'thursday', label: 'Thursday ' },
    { key: 'friday', label: 'Friday ' },
    { key: 'saturday', label: 'Saturday ' },
    { key: 'sunday', label: 'Sunday ' },
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await getSettings();
      if (response.success) {
        setSettings(prev => ({
          ...prev,
          ...response.data,
          weekly_schedule: response.data.weekly_schedule || prev.weekly_schedule,
          business_name: response.data.business_name || '',
          business_address: response.data.business_address || '',
        }));
      }
    } catch (error) {
      toast.error('Failed to load settings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await updateSettings(settings);
      if (response.success) {
        toast.success('Settings updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update settings');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWeeklyScheduleChange = (day, field, value) => {
    setSettings((prev) => ({
      ...prev,
      weekly_schedule: {
        ...prev.weekly_schedule,
        [day]: {
          ...(prev.weekly_schedule?.[day] || { enabled: false, start: '09:00', end: '18:00' }),
          [field]: value,
        },
      },
    }));
  };

  const handleSlotDurationChange = (index, field, value) => {
    setSettings((prev) => {
      const newDurations = [...prev.slot_durations];
      newDurations[index] = {
        ...newDurations[index],
        [field]: field === 'price' ? parseInt(value) : parseInt(value),
      };
      return {
        ...prev,
        slot_durations: newDurations,
      };
    });
  };

  const addSlotDuration = () => {
    setSettings((prev) => ({
      ...prev,
      slot_durations: [...prev.slot_durations, { duration: 45, price: 750 }],
    }));
  };

  const removeSlotDuration = (index) => {
    if (settings.slot_durations.length <= 1) {
      toast.error('At least one slot duration is required');
      return;
    }
    setSettings((prev) => ({
      ...prev,
      slot_durations: prev.slot_durations.filter((_, i) => i !== index),
    }));
  };

  const handleAddOffDay = async () => {
    if (!newOffDay) {
      toast.error('Please select a date');
      return;
    }

    try {
      const response = await addOffDay(newOffDay);
      if (response.success) {
        toast.success('Off day added');
        setSettings((prev) => ({
          ...prev,
          off_days: [...(prev.off_days || []), newOffDay],
        }));
        setNewOffDay('');
      }
    } catch (error) {
      toast.error('Failed to add off day');
      console.error(error);
    }
  };

  const handleRemoveOffDay = async (date) => {
    try {
      const response = await removeOffDay(date);
      if (response.success) {
        toast.success('Off day removed');
        setSettings((prev) => ({
          ...prev,
          off_days: (prev.off_days || []).filter(d => d !== date),
        }));
      }
    } catch (error) {
      toast.error('Failed to remove off day');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-800 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading settings...</p>
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
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-900 rounded-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 text-sm md:text-base mt-1">Manage your booking system preferences</p>
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Business Information - Full Width on Mobile, 8 cols on Desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">Business Information</h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={settings.business_name}
                    onChange={(e) => handleChange('business_name', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none"
                    placeholder="Enter your business name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={settings.business_address}
                    onChange={(e) => handleChange('business_address', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none"
                    placeholder="Enter your business address"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Booking Rules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">Booking Rules</h2>
            </div>
            <div className="p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Advance Booking Days
              </label>
              <input
                type="number"
                value={settings.advance_booking_days}
                onChange={(e) => handleChange('advance_booking_days', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none"
                min="1"
                max="90"
              />
              <p className="mt-2 text-xs text-gray-500">Maximum days customers can book in advance</p>
            </div>
          </motion.div>

          {/* Slot Durations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-12 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">Slot Durations & Pricing</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {settings.slot_durations.map((slot, index) => (
                  <div key={index} className="relative bg-gray-50 border border-gray-200 rounded-lg p-4 group hover:border-gray-300 hover:shadow-sm transition-all">
                    <button
                      onClick={() => removeSlotDuration(index)}
                      className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 z-10"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                          Duration (minutes)
                        </label>
                        <input
                          type="number"
                          value={slot.duration}
                          onChange={(e) => handleSlotDurationChange(index, 'duration', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none bg-white text-sm"
                          placeholder="30"
                          min="15"
                          step="15"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                          Price (₹)
                        </label>
                        <input
                          type="number"
                          value={slot.price}
                          onChange={(e) => handleSlotDurationChange(index, 'price', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none bg-white text-sm"
                          placeholder="500"
                          min="0"
                          step="50"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={addSlotDuration}
                  className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-gray-400 hover:bg-gray-50 transition-all group min-h-[160px]"
                >
                  <div className="p-3 bg-gray-100 rounded-full group-hover:bg-gray-900 transition-all">
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900">Add Duration</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Weekly Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">Weekly Schedule</h2>
            </div>
            <div className="p-6 space-y-3">
              {daysOfWeek.map(({ key, label }) => (
                <div
                  key={key}
                  className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-lg border transition-all ${
                    settings.weekly_schedule?.[key]?.enabled
                      ? 'bg-gray-50 border-gray-900'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4 sm:min-w-[200px]">

                    <span className={`font-bold text-sm ${
                      settings.weekly_schedule?.[key]?.enabled ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {label}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.weekly_schedule?.[key]?.enabled || false}
                        onChange={(e) => handleWeeklyScheduleChange(key, 'enabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                    </label>
                  </div>

                  {settings.weekly_schedule?.[key]?.enabled && (
                    <div className="flex flex-wrap items-center gap-3 flex-1">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-gray-700 whitespace-nowrap">Start:</label>
                        <input
                          type="time"
                          value={settings.weekly_schedule?.[key]?.start || '09:00'}
                          onChange={(e) => handleWeeklyScheduleChange(key, 'start', e.target.value)}
                          className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-sm font-medium"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-gray-700 whitespace-nowrap">End:</label>
                        <input
                          type="time"
                          value={settings.weekly_schedule?.[key]?.end || '18:00'}
                          onChange={(e) => handleWeeklyScheduleChange(key, 'end', e.target.value)}
                          className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-sm font-medium"
                        />
                      </div>
                    </div>
                  )}

                  {!settings.weekly_schedule?.[key]?.enabled && (
                    <div className="flex-1">
                      <span className="text-sm text-gray-400 font-medium">Closed</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Off Days & Notifications */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Off Days */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-900">Special Off Days</h2>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Add Holiday/Off Day
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={newOffDay}
                      onChange={(e) => setNewOffDay(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-sm"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <button
                      onClick={handleAddOffDay}
                      className="px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all text-sm whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Scheduled Off Days ({settings.off_days?.length || 0})
                  </label>
                  <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                    {settings.off_days && settings.off_days.length > 0 ? (
                      settings.off_days.map((date) => (
                        <div
                          key={date}
                          className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 transition-all group"
                        >
                          <span className="font-medium text-gray-900 text-sm">
                            {new Date(date).toLocaleDateString('en-IN', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          <button
                            onClick={() => handleRemoveOffDay(date)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <svg className="w-12 h-12 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">No off days scheduled</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Reminder Hours Before
                  </label>
                  <input
                    type="number"
                    value={settings.reminder_hours}
                    onChange={(e) => handleChange('reminder_hours', parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                    min="1"
                    max="72"
                  />
                  <p className="mt-1.5 text-xs text-gray-500">Hours before sending reminders</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">Email Notifications</p>
                          <p className="text-xs text-gray-500">Send via email</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.email_notifications}
                          onChange={(e) => handleChange('email_notifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                      </label>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">SMS Notifications</p>
                          <p className="text-xs text-gray-500">Send via SMS</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.sms_notifications}
                          onChange={(e) => handleChange('sms_notifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-end gap-3 pt-6"
        >
          <button
            onClick={fetchSettings}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={saving}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Settings
              </>
            )}
          </button>
        </motion.div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default Settings;