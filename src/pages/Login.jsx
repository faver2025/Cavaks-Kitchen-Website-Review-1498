import React from 'react';
import TrueSSOLogin from '../components/TrueSSOLogin';

const Login = ({ setUser }) => {
  console.log('🔍 Login page rendered at:', new Date().toISOString());

  const handleLoginSuccess = () => {
    console.log('✅ Login success callback called');
  };

  return (
    <div className="min-h-screen">
      <TrueSSOLogin setUser={setUser} onSuccess={handleLoginSuccess} demo={true} />
    </div>
  );
};

export default Login;