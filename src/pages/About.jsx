import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="pt-16 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-playfair">
            Our Story
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A culinary journey that began with passion and continues with excellence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-playfair">
              Welcome to Cavak's Kitchen
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Founded in 2015, Cavak's Kitchen has been serving exceptional cuisine to our community for over 8 years. 
              Our restaurant was born from a simple dream: to create a place where food lovers could experience the 
              perfect harmony of traditional techniques and modern innovation.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Our head chef, Maria Cavak, brings over 20 years of international culinary experience, having trained 
              in some of the world's finest kitchens. Her passion for fresh, locally-sourced ingredients and creative 
              presentation has earned Cavak's Kitchen numerous accolades and a devoted following.
            </p>
            <p className="text-lg text-gray-600">
              We believe that dining is not just about food – it's about creating memories, fostering connections, 
              and celebrating life's special moments. Every dish that leaves our kitchen is prepared with love, 
              attention to detail, and a commitment to excellence that defines who we are.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-96 bg-cover bg-center rounded-lg shadow-lg"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80)'
            }}
          ></motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gray-50 rounded-lg p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">
            Our Philosophy
          </h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            "Cooking is an art, but dining is an experience. We strive to create not just meals, but moments 
            that linger in your memory long after the last bite. Every ingredient tells a story, every dish 
            carries our passion, and every guest becomes part of our extended family."
          </p>
          <p className="text-amber-600 font-semibold mt-4">
            - Maria Cavak, Head Chef & Owner
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;