import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Welcome, {user?.firstName}!</h2>
        <p className="text-gray-600 mb-4">
          This is your dashboard where you can manage your equestrian marketplace activities.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <Link
            to="/profile"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            View Profile
          </Link>
          
          {user?.userType === 'seller' && (
            <Link
              to="/listings/create"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Create Listing
            </Link>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Activity Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Activity Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Favorites</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Messages</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Recent Views</span>
              <span className="font-medium">0</span>
            </div>
          </div>
        </div>
        
        {/* My Listings - For Sellers */}
        {user?.userType === 'seller' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">My Listings</h3>
            <p className="text-gray-600 mb-4">
              You don't have any active listings yet.
            </p>
            <Link
              to="/listings/create"
              className="text-blue-600 hover:underline"
            >
              Create your first listing
            </Link>
          </div>
        )}
        
        {/* Recent Searches - For Buyers */}
        {user?.userType === 'buyer' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Searches</h3>
            <p className="text-gray-600 mb-4">
              You haven't made any searches yet.
            </p>
            <Link
              to="/search"
              className="text-blue-600 hover:underline"
            >
              Start browsing
            </Link>
          </div>
        )}
        
        {/* Marketplace Tips */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Marketplace Tips</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Complete your profile to build trust with other users</li>
            <li>Add detailed descriptions to your listings</li>
            <li>Include high-quality photos</li>
            <li>Respond promptly to messages</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;