import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getCAList } from '../services/api';

const CAListing = () => {
  const [caList, setCAList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCA, setSelectedCA] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, tax, audit, corporate, etc.

  useEffect(() => {
    fetchCAList();
  }, []);

  const fetchCAList = async () => {
    setLoading(true);
    try {
      const response = await getCAList();
      
      if (response.success) {
        const caData = response.data.cas || response.data || [];
        // ✅ Filter only active CAs for users
        const activeCAs = caData.filter(ca => ca.status === 'active');
        setCAList(activeCAs);
      } else {
        toast.error(response.message || 'Failed to fetch CA list');
      }
    } catch (error) {
      toast.error('Failed to fetch CA list');
      console.error('Error fetching CA list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKnowMore = (ca) => {
    setSelectedCA(ca);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedCA(null);
  };

  // ✅ Get unique specializations for filter
  const specializations = ['all', ...new Set(caList.map(ca => ca.specialization?.toLowerCase()).filter(Boolean))];

  // ✅ Filter CAs based on selected specialization
  const filteredCAs = filter === 'all' 
    ? caList 
    : caList.filter(ca => ca.specialization?.toLowerCase() === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading our professionals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Meet Our Expert Team
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Highly qualified Chartered Accountants ready to help you with tax, audit, and financial consulting
          </p>
        </motion.div>

        {/* Filter Buttons */}
        {specializations.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            {specializations.map((spec) => (
              <button
                key={spec}
                onClick={() => setFilter(spec)}
                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
                  filter === spec
                    ? 'bg-gray-900 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {spec.charAt(0).toUpperCase() + spec.slice(1)}
              </button>
            ))}
          </motion.div>
        )}

        {/* CA Cards Grid */}
        {filteredCAs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No CAs Found</h3>
            <p className="text-gray-500">Try selecting a different specialization</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCAs.map((ca, index) => (
              <motion.div
                key={ca.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                {/* Card Header with Profile Picture */}
                <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  {ca.profile_picture ? (
                    <img 
                      src={ca.profile_picture} 
                      alt={ca.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-xl">
                      <span className="text-5xl font-bold text-gray-900">
                        {ca.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  {/* Specialization Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full text-xs font-bold shadow-lg">
                      {ca.specialization}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Name and Qualification */}
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {ca.name}
                    </h3>
                    {ca.qualification && (
                      <p className="text-gray-600 font-medium">
                        {ca.qualification}
                      </p>
                    )}
                  </div>

                  {/* Experience */}
                  <div className="flex items-center justify-center gap-2 mb-4 text-gray-700">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold">
                      {ca.experience || 0}+ years experience
                    </span>
                  </div>

                  {/* Introduction Preview */}
                  {ca.intro && (
                    <p className="text-sm text-gray-600 text-center mb-6 line-clamp-3 leading-relaxed">
                      {ca.intro}
                    </p>
                  )}

                  {/* Know More Button */}
                  <button
                    onClick={() => handleKnowMore(ca)}
                    className="w-full px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold flex items-center justify-center gap-2 group-hover:scale-105"
                  >
                    <span>Know More</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* CA Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedCA && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="relative h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                {selectedCA.profile_picture ? (
                  <img 
                    src={selectedCA.profile_picture} 
                    alt={selectedCA.name}
                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-2xl"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-white flex items-center justify-center shadow-2xl">
                    <span className="text-6xl font-bold text-gray-900">
                      {selectedCA.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                
                {/* Close Button */}
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-colors text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-256px)]">
                {/* Name and Qualification */}
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedCA.name}
                  </h2>
                  {selectedCA.qualification && (
                    <p className="text-lg text-gray-600 font-medium">
                      {selectedCA.qualification}
                    </p>
                  )}
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-600">Specialization</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{selectedCA.specialization}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-600">Experience</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{selectedCA.experience || 0}+ years</p>
                  </div>
                </div>

                {/* Professional Introduction */}
                {selectedCA.intro && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      About
                    </h3>
                    <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-200">
                      {selectedCA.intro}
                    </p>
                  </div>
                )}

                {/* Book Appointment CTA */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-center">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Ready to get started?
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Book a consultation with {selectedCA.name.split(' ')[0]}
                  </p>
                  <button className="w-full px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-all font-bold flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Book Appointment
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CAListing;