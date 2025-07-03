import React from 'react';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiFacebook, FiInstagram, FiTwitter, FiMail } = FiIcons;

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 font-playfair text-amber-400">
              Cavak's Kitchen
            </h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Experience the perfect blend of tradition and innovation in every meal. 
              Where culinary artistry meets authentic flavors.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors duration-200">
                <SafeIcon icon={FiFacebook} className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors duration-200">
                <SafeIcon icon={FiInstagram} className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors duration-200">
                <SafeIcon icon={FiTwitter} className="w-6 h-6" />
              </a>
              <a href="mailto:info@cavakskitchen.com" className="text-gray-400 hover:text-amber-400 transition-colors duration-200">
                <SafeIcon icon={FiMail} className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-amber-400 transition-colors duration-200">Home</Link></li>
              <li><Link to="/menu" className="text-gray-300 hover:text-amber-400 transition-colors duration-200">Menu</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-amber-400 transition-colors duration-200">About</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-amber-400 transition-colors duration-200">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-gray-300">
              <p>123 Culinary Street</p>
              <p>Foodie District, NY 10001</p>
              <p>(555) 123-4567</p>
              <p>Mon-Sun: 5:00 PM - 11:00 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Cavak's Kitchen. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;