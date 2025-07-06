import React from 'react';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiMapPin, FiClock } = FiIcons;

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="https://cavaks-kitchen.com/wp-content/uploads/2024/01/logo-1.png"
                alt="Cavak's Kitchen"
                className="h-10 w-auto filter brightness-0 invert"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <h3 className="text-2xl font-bold text-orange-400 dark:text-orange-300" style={{ display: 'none' }}>
                Cavak's Kitchen
              </h3>
            </div>
            <p className="text-gray-300 dark:text-gray-400 mb-4 max-w-md">
              料理を通じて人生を豊かにする総合プラットフォーム。
              プロの技術を学び、最高の料理体験をお届けします。
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/cavakskitchen"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 dark:text-gray-500 hover:text-orange-400 dark:hover:text-orange-300 transition-colors duration-200"
              >
                <SafeIcon icon={FiFacebook} className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/cavakskitchen"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 dark:text-gray-500 hover:text-orange-400 dark:hover:text-orange-300 transition-colors duration-200"
              >
                <SafeIcon icon={FiInstagram} className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com/cavakskitchen"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 dark:text-gray-500 hover:text-orange-400 dark:hover:text-orange-300 transition-colors duration-200"
              >
                <SafeIcon icon={FiTwitter} className="w-6 h-6" />
              </a>
              <a
                href="mailto:info@cavaks-kitchen.com"
                className="text-gray-400 dark:text-gray-500 hover:text-orange-400 dark:hover:text-orange-300 transition-colors duration-200"
              >
                <SafeIcon icon={FiMail} className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">メニュー</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 dark:text-gray-400 hover:text-orange-400 dark:hover:text-orange-300 transition-colors duration-200"
                >
                  ホーム
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  className="text-gray-300 dark:text-gray-400 hover:text-orange-400 dark:hover:text-orange-300 transition-colors duration-200"
                >
                  オンラインコース
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="text-gray-300 dark:text-gray-400 hover:text-orange-400 dark:hover:text-orange-300 transition-colors duration-200"
                >
                  ショップ
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 dark:text-gray-400 hover:text-orange-400 dark:hover:text-orange-300 transition-colors duration-200"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 dark:text-gray-400 hover:text-orange-400 dark:hover:text-orange-300 transition-colors duration-200"
                >
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">お問い合わせ</h4>
            <div className="space-y-3 text-gray-300 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiMapPin} className="w-4 h-4 text-orange-400 dark:text-orange-300" />
                <span className="text-sm">東京都港区青山1-2-3 青山ビル5F</span>
              </div>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiPhone} className="w-4 h-4 text-orange-400 dark:text-orange-300" />
                <a
                  href="tel:+81-3-6234-5678"
                  className="text-sm hover:text-orange-400 dark:hover:text-orange-300 transition-colors"
                >
                  03-6234-5678
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiMail} className="w-4 h-4 text-orange-400 dark:text-orange-300" />
                <a
                  href="mailto:info@cavaks-kitchen.com"
                  className="text-sm hover:text-orange-400 dark:hover:text-orange-300 transition-colors"
                >
                  info@cavaks-kitchen.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiClock} className="w-4 h-4 text-orange-400 dark:text-orange-300" />
                <span className="text-sm">平日 9:00-18:00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 dark:text-gray-500">
            © 2024 Cavak's Kitchen. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;