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
    
    const url = `/appointment?ca_id=${caId}`;
    console.log('Navigating to:', url);
    console.log('===========================');
    
    navigate(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Expert Chartered Accountants
          </h1>
          <p className="text-lg text-gray-600">
            Professional CA services for all your financial needs
          </p>
        </div>

        {/* CA Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caList.map((ca) => {
            const caId = getCAId(ca);
            return (
              <motion.div
                key={caId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden"
              >
                {/* Profile Picture */}
                <div className="h-48 bg-gray-900 flex items-center justify-center">
                  {ca.profile_picture ? (
                    <img 
                      src={ca.profile_picture} 
                      alt={ca.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center">
                      <span className="text-4xl font-bold text-gray-900">
                        {ca.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 text-center">
                    {ca.name}
                  </h3>
                  {ca.qualification && (
                    <p className="text-gray-600 text-center mb-4">
                      {ca.qualification}
                    </p>
                  )}

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-700">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{ca.specialization}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{ca.experience || 0}+ years experience</span>
                    </div>
                  </div>

                  {ca.intro && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {ca.intro}
                    </p>
                  )}

                  <button
                    onClick={() => setSelectedCA(ca)}
                    className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                  >
                    Know More
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedCA && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="relative h-56 bg-gray-900 flex items-center justify-center">
                {selectedCA.profile_picture ? (
                  <img 
                    src={selectedCA.profile_picture} 
                    alt={selectedCA.name}
                    className="w-36 h-36 rounded-full object-cover border-4 border-white"
                  />
                ) : (
                  <div className="w-36 h-36 rounded-full bg-white flex items-center justify-center">
                    <span className="text-5xl font-bold text-gray-900">
                      {selectedCA.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                
                <button
                  onClick={() => setSelectedCA(null)}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-224px)]">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedCA.name}
                  </h2>
                  {selectedCA.qualification && (
                    <p className="text-lg text-gray-600">{selectedCA.qualification}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Specialization</p>
                    <p className="font-bold text-gray-900">{selectedCA.specialization}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Experience</p>
                    <p className="font-bold text-gray-900">{selectedCA.experience || 0}+ years</p>
                  </div>
                </div>

                {selectedCA.intro && (
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-900 mb-2">About</h3>
                    <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4">
                      {selectedCA.intro}
                    </p>
                  </div>
                )}

                <button 
                  onClick={() => handleBookAppointment(selectedCA)}
                  className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-bold"
                >
                  Book Appointment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CAListingSimple;