// ステップ3: ルーティングを追加
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

function Home() {
  return <h1>Home Page 🏠</h1>;
}

function About() {
  return <h1>About Page ℹ️</h1>;
}

export default function App() {
  return (
    <Router>
      <div className="p-8">
        <nav className="mb-4">
          <a href="#/" className="mr-4 text-blue-500">Home</a>
          <a href="#/about" className="text-blue-500">About</a>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}