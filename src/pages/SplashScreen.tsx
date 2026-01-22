import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const SplashScreen = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/language');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-200/30 blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-pink-200/30 blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-200/20 blur-3xl animate-pulse-slow"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Content container */}
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.8
          }}
          className="text-center"
        >
          {/* App Logo */}
          <div className="mb-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              className="w-96 h-48 mx-auto relative bg-white rounded-3xl p-8 shadow-lg"
            >
              <img
                src="/logo.svg"
                alt="Zero Barrier"
                className="w-full h-full object-contain"
              />
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-black/5 rounded-full blur-sm" />
            </motion.div>
          </div>
          
          {/* Tagline */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-blue-900/80 font-medium mb-12 max-w-md mx-auto leading-relaxed text-center"
          >
            {t.tagline}
          </motion.p>
          
          {/* Loading indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center items-center space-x-3"
          >
            <div className="w-2 h-2 bg-blue-400/80 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-blue-500/80 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-blue-600/80 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </motion.div>
        </motion.div>

        {/* Version number */}
        <div className="absolute bottom-4 right-4 text-blue-900/40 text-sm">
          v1.0.0
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;