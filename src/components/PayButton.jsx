import { motion } from 'framer-motion';

const PayButton = ({ onClick, disabled, loading, amount = 500 }) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 active:bg-gray-950 transition-colors font-semibold text-sm sm:text-base md:text-lg flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
          <span>Processing...</span>
        </>
      ) : (
        <>
          <svg 
            className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
          </svg>
          <span className="truncate">Pay ₹{amount} & Book Appointment</span>
        </>
      )}
    </motion.button>
  );
};

export default PayButton;