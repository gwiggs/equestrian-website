import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Extract token from URL query parameters and verify email on component mount
  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(location.search);
      const tokenParam = params.get('token');
      
      if (!tokenParam) {
        setError('Verification token is missing. Please check your verification link.');
        setLoading(false);
        return;
      }
      
      setToken(tokenParam);
      
      try {
        // Make API request to verify email
        await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/verify/${tokenParam}`);
        
        // Set success state
        setSuccess(true);
        
        // Redirect to login after a delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
        
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to verify email. Please try again.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    verifyEmail();
  }, [location.search, navigate]);
  
  if (loading) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-6">Verifying Your Email</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <p className="mt-4 text-gray-600">Please wait while we verify your email address...</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold mb-6">Email Verification</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success ? (
        <div>
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            Your email has been verified successfully! You will be redirected to the login page.
          </div>
          <p className="mt-4">
            <Link to="/login" className="text-blue-600 hover:underline">
              Go to login
            </Link>
          </p>
        </div>
      ) : (
        <div>
          {error && (
            <div className="mt-4">
              <p>
                If your verification link has expired, you can{' '}
                <Link to="/login" className="text-blue-600 hover:underline">
                  log in
                </Link>{' '}
                to request a new verification email.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;