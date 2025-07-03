import React from 'react';
import { motion } from 'framer-motion';

const FeaturedDishes = () => {
  const dishes = [
    {
      name: 'Grilled Salmon',
      description: 'Fresh Atlantic salmon with herb butter and seasonal vegetables',
      price: '$28',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Beef Tenderloin',
      description: 'Premium cut with truffle sauce and roasted potatoes',
      price: '$36',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Lobster Risotto',
      description: 'Creamy arborio rice with fresh lobster and parmesan',
      price: '$42',
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d51a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-playfair">
            Featured Dishes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our chef's signature creations, crafted with the finest ingredients
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dishes.map((dish, index) => (
            <motion.div
              key={dish.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${dish.image})` }}></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{dish.name}</h3>
                  <span className="text-amber-600 font-bold text-lg">{dish.price}</span>
                </div>
                <p className="text-gray-600">{dish.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDishes;