import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import FeaturedDishes from '../components/FeaturedDishes';
import RestaurantHighlights from '../components/RestaurantHighlights';

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedDishes />
      <RestaurantHighlights />
    </div>
  );
};

export default Home;