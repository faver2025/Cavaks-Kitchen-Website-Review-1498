import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiAward, FiClock, FiUsers, FiHeart } = FiIcons;

const RestaurantHighlights = () => {
  const highlights = [
    {
      icon: FiAward,
      title: 'Award Winning',
      description: 'Recognized for culinary excellence and outstanding service'
    },
    {
      icon: FiClock,
      title: 'Fresh Daily',
      description: 'Ingredients sourced fresh daily from local farms and markets'
    },
    {
      icon: FiUsers,
      title: 'Expert Chefs',
      description: 'Our skilled chefs bring years of international experience'
    },
    {
      icon: FiHeart,
      title: 'Made with Love',
      description: 'Every dish is prepared with passion and attention to detail'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-playfair">
            Why Choose Cavak's Kitchen
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the perfect blend of tradition and innovation in every meal
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((highlight, index) => (
            <motion.div
              key={highlight.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                <SafeIcon icon={highlight.icon} className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{highlight.title}</h3>
              <p className="text-gray-600">{highlight.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RestaurantHighlights;