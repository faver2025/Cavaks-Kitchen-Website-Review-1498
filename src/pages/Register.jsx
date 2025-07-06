import React from 'react';
import TrueSSOLogin from '../components/TrueSSOLogin';

const Register = ({ setUser }) => {
  return (
    <div className="pt-16">
      <TrueSSOLogin setUser={setUser} />
    </div>
  );
};

export default Register;