import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getCAList } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CAListingResponsive = () => {
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
        
        console.log('=== CA LISTING DEBUG ===');
        console.log('Total Active CAs:', activeCAs.length);
        if (activeCAs.length > 0) {
          console.log('First CA Full Object:', activeCAs[0]);
          console.log('First CA Keys:', Object.keys(activeCAs[0]));
        }
        console.log('========================');
        
        setCAList(activeCAs);
      } else {
        toast.error('Failed to load professionals');
      }
    } catch (error) {
      toast.error('Failed to load professionals');
    } finally {
      setLoading(false);
    }
  };

  const getCAId = (ca) => {
    return ca.id || ca._id || ca.ca_id || ca.userId || ca.user_id;
  };

  const handleBookAppointment = (ca) => {
    const caId = getCAId(ca);
    
    if (!caId) {
      toast.error('Unable to book appointment - CA ID not found');
      return;
    }
    
    navigate(`/book?ca_id=${caId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-poppins font-medium text-sm sm:text-base">Loading professionals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-6 sm:pb-10 bg-[#f4f5f9]">
      {/* Hero Header */}
      <div className="cas-header relative overflow-hidden">
        <div className="flex items-center justify-center min-h-[50vh] sm:min-h-[60vh] lg:min-h-[80vh] px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto py-8 sm:py-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 font-archivo leading-tight">
              Our Expert Chartered Accountants
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white font-poppins max-w-2xl mx-auto px-4">
              Professional CA services for all your financial needs
            </p>
          </div>
        </div>
      </div>

      {/* CA Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 lg:-mt-16">
        <div className="space-y-4 sm:space-y-5 lg:space-y-6 max-w-full lg:max-w-[85%] xl:max-w-[80%] mx-auto">
          {caList.map((ca) => {
            const caId = getCAId(ca);
            return (
              <motion.div
                key={caId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  
                  {/* Profile Picture */}
                  <div className="relative w-full sm:w-32 md:w-40 lg:w-48 xl:w-56 h-48 sm:h-auto bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {ca.profile_picture ? (
                      <img 
                        src={ca.profile_picture} 
                        alt={ca.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-600 font-archivo">
                          {ca.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    {ca.specialization && (
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                        <span className="px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 bg-blue-600 text-white rounded-full text-xs sm:text-sm font-bold shadow-lg font-poppins whitespace-nowrap">
                          {ca.specialization}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 sm:p-5 lg:p-6 xl:p-8 flex flex-col justify-between">
                    <div className="flex-1">
                      <div className="mb-3 sm:mb-4">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-1.5 font-archivo leading-tight">
                          {ca.name}
                        </h3>
                        {ca.qualification && (
                          <p className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium font-poppins">
                            {ca.qualification}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                        {ca.specialization && (
                          <div className="hidden sm:flex items-center text-xs sm:text-sm text-gray-700">
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="font-poppins">{ca.specialization}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center text-xs sm:text-sm text-gray-700">
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-poppins">{ca.experience || 0}+ years experience</span>
                        </div>
                      </div>

                      {ca.intro && (
                        <p className="text-xs sm:text-sm lg:text-base text-gray-600 line-clamp-2 sm:line-clamp-2 lg:line-clamp-3 leading-relaxed font-poppins mb-3 sm:mb-4">
                          {ca.intro}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 pt-2 sm:pt-3">
                      <button
                        onClick={() => setSelectedCA(ca)}
                        className="flex-1 px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold text-xs sm:text-sm lg:text-base flex items-center justify-center gap-1.5 sm:gap-2 font-poppins active:scale-95"
                      >
                        <span>Know More</span>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleBookAppointment(ca)}
                        className="flex-1 px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold text-xs sm:text-sm lg:text-base flex items-center justify-center gap-1.5 sm:gap-2 shadow-md font-poppins hover:shadow-lg active:scale-95"
                      >
                        <span>Book Now</span>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedCA && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 lg:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row max-h-[95vh] sm:max-h-[90vh]">
                
                {/* Profile Section */}
                <div className="lg:w-2/5 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-5 sm:p-6 lg:p-8 xl:p-10 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/5 rounded-full -mr-24 sm:-mr-32 -mt-24 sm:-mt-32"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/5 rounded-full -ml-16 sm:-ml-24 -mb-16 sm:-mb-24"></div>
                  
                  <button
                    onClick={() => setSelectedCA(null)}
                    className="absolute top-3 left-3 sm:top-4 sm:left-4 p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all text-white z-10 backdrop-blur-sm active:scale-95"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="mb-3 sm:mb-4 lg:mb-6">
                      {selectedCA.profile_picture ? (
                        <img 
                          src={selectedCA.profile_picture} 
                          alt={selectedCA.name}
                          className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 xl:w-44 xl:h-44 rounded-full object-cover border-4 border-white/30 shadow-2xl"
                        />
                      ) : (
                        <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 xl:w-44 xl:h-44 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 shadow-2xl">
                          <span className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white font-archivo">
                            {selectedCA.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1.5 sm:mb-2 font-archivo leading-tight px-2">
                      {selectedCA.name}
                    </h2>
                    
                    {selectedCA.qualification && (
                      <p className="text-sm sm:text-base lg:text-lg text-blue-100 mb-3 sm:mb-4 lg:mb-6 font-poppins px-2">
                        {selectedCA.qualification}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 w-full max-w-xs sm:max-w-sm">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4 border border-white/20">
                        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-[10px] sm:text-xs text-blue-200 mb-0.5 sm:mb-1 font-poppins">Specialization</p>
                        <p className="text-xs sm:text-sm font-bold font-archivo leading-tight">{selectedCA.specialization}</p>
                      </div>
                      
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4 border border-white/20">
                        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-[10px] sm:text-xs text-blue-200 mb-0.5 sm:mb-1 font-poppins">Experience</p>
                        <p className="text-xs sm:text-sm font-bold font-archivo">{selectedCA.experience || 0}+ years</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="lg:w-3/5 p-4 sm:p-6 lg:p-8 xl:p-10 overflow-y-auto bg-gray-50 max-h-[50vh] lg:max-h-full">
                  <div className="mb-4 sm:mb-5 lg:mb-6">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 font-archivo flex items-center gap-2">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Professional Profile
                    </h3>
                    <div className="h-1 w-16 sm:w-20 bg-blue-600 rounded-full"></div>
                  </div>

                  {selectedCA.intro && (
                    <div className="mb-5 sm:mb-6 lg:mb-8">
                      <div className="bg-white rounded-lg sm:rounded-xl p-3.5 sm:p-4 lg:p-6 border border-gray-200 shadow-sm">
                        <h4 className="text-[10px] sm:text-xs lg:text-sm font-bold text-gray-500 uppercase tracking-wide mb-2 sm:mb-3 font-poppins">About</h4>
                        <p className="text-xs sm:text-sm lg:text-base text-gray-700 leading-relaxed font-poppins">
                          {selectedCA.intro}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mb-5 sm:mb-6 lg:mb-8">
                    <h4 className="text-[10px] sm:text-xs lg:text-sm font-bold text-gray-500 uppercase tracking-wide mb-2.5 sm:mb-3 lg:mb-4 font-poppins">Expertise</h4>
                    <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
                      <div className="flex items-center gap-2.5 sm:gap-3 bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 font-poppins">{selectedCA.specialization}</p>
                          <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500 font-poppins">Specialized services</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2.5 sm:gap-3 bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 font-poppins">{selectedCA.experience || 0}+ Years of Experience</p>
                          <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500 font-poppins">Proven track record</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 text-white">
                    <h4 className="text-base sm:text-lg lg:text-xl font-bold mb-1.5 sm:mb-2 font-archivo">Ready to get started?</h4>
                    <p className="text-xs sm:text-sm lg:text-base text-blue-100 mb-3 sm:mb-4 lg:mb-5 font-poppins">
                      Schedule a consultation with {selectedCA.name.split(' ')[0]} today
                    </p>
                    <button 
                      onClick={() => handleBookAppointment(selectedCA)}
                      className="w-full px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 lg:py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-bold text-xs sm:text-sm lg:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl font-poppins group active:scale-95"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Book Appointment Now</span>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CAListingResponsive;