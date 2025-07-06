import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const { FiSun, FiMoon } = FiIcons;

const ThemeToggle = ({ className = '' }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleDarkMode}
      className={`
        relative p-2 rounded-lg transition-colors duration-200
        ${isDarkMode 
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
          : 'bg-gray-100 text-orange-600 hover:bg-gray-200'
        }
        ${className}
      `}
      aria-label={isDarkMode ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: isDarkMode ? 0 : 180,
          scale: isDarkMode ? 1 : 0.8
        }}
        transition={{ duration: 0.3 }}
      >
        <SafeIcon 
          icon={isDarkMode ? FiMoon : FiSun} 
          className="w-5 h-5" 
        />
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;