import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center px-4 py-16">
      <h2 className="text-6xl font-bold text-blue-600 mb-4">404</h2>
      <h3 className="text-2xl font-semibold mb-4">Page Not Found</h3>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>
      <div className="flex space-x-4">
        <Link
          to="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Go to Home
        </Link>
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;