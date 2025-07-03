import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('appetizers');

  const categories = [
    { id: 'appetizers', name: 'Appetizers' },
    { id: 'mains', name: 'Main Courses' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'beverages', name: 'Beverages' }
  ];

  const menuItems = {
    appetizers: [
      { name: 'Bruschetta Trio', description: 'Three varieties of our signature bruschetta', price: '$12' },
      { name: 'Calamari Fritti', description: 'Crispy squid rings with marinara sauce', price: '$14' },
      { name: 'Cheese Board', description: 'Selection of artisanal cheeses with accompaniments', price: '$18' },
      { name: 'Shrimp Cocktail', description: 'Jumbo shrimp with cocktail sauce', price: '$16' }
    ],
    mains: [
      { name: 'Grilled Salmon', description: 'Fresh Atlantic salmon with herb butter and seasonal vegetables', price: '$28' },
      { name: 'Beef Tenderloin', description: 'Premium cut with truffle sauce and roasted potatoes', price: '$36' },
      { name: 'Lobster Risotto', description: 'Creamy arborio rice with fresh lobster and parmesan', price: '$42' },
      { name: 'Chicken Piccata', description: 'Pan-seared chicken with lemon caper sauce', price: '$24' },
      { name: 'Vegetarian Pasta', description: 'Seasonal vegetables with house-made pasta', price: '$22' }
    ],
    desserts: [
      { name: 'Tiramisu', description: 'Classic Italian dessert with mascarpone and coffee', price: '$8' },
      { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with vanilla ice cream', price: '$10' },
      { name: 'Crème Brûlée', description: 'Vanilla custard with caramelized sugar', price: '$9' },
      { name: 'Seasonal Fruit Tart', description: 'Fresh fruit on pastry cream base', price: '$8' }
    ],
    beverages: [
      { name: 'House Wine Selection', description: 'Red, white, and rosé options', price: '$8-12' },
      { name: 'Craft Beer', description: 'Local and imported selections', price: '$6-10' },
      { name: 'Specialty Cocktails', description: 'Handcrafted cocktails with premium spirits', price: '$12-16' },
      { name: 'Fresh Juices', description: 'Freshly squeezed seasonal juices', price: '$5' }
    ]
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-playfair">
            Our Menu
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our carefully curated selection of dishes, each prepared with the finest ingredients
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center mb-8 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                activeCategory === category.id
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-amber-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {menuItems[activeCategory].map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                <span className="text-amber-600 font-bold text-lg">{item.price}</span>
              </div>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Menu;