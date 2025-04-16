import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!email) {
      setError('Email is required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Make API request
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, { email });
      
      // Show success message
      setSuccess(true);
      
    } catch (err) {
      // Always show success even if email is not found (security best practice)
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success ? (
        <div className="text-center">
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            If your email exists in our system, you will receive a password reset link shortly.
          </div>
          <p className="mt-4">
            <Link to="/login" className="text-blue-600 hover:underline">
              Return to login
            </Link>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <p className="mb-4 text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
          
          <div className="mt-4 text-center">
            <Link to="/login" className="text-blue-600 hover:underline">
              Back to login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;