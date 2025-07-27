import React from 'react';

const ProfileSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header skeleton */}
      <div className="text-center mb-8">
        <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile card skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
            {/* Avatar skeleton */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>

            {/* Profile info skeleton */}
            <div className="space-y-4">
              <div>
                <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
              <div>
                <div className="h-3 bg-gray-200 rounded w-12 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
              <div>
                <div className="h-3 bg-gray-200 rounded w-14 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
              <div>
                <div className="h-3 bg-gray-200 rounded w-10 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>

            {/* Edit button skeleton */}
            <div className="mt-6">
              <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
            </div>
          </div>
        </div>

        {/* Skills section skeleton */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-24 mb-6"></div>
            
            {/* Skills tags skeleton */}
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="h-8 bg-gray-200 rounded-full w-20"></div>
              <div className="h-8 bg-gray-200 rounded-full w-24"></div>
              <div className="h-8 bg-gray-200 rounded-full w-16"></div>
              <div className="h-8 bg-gray-200 rounded-full w-22"></div>
              <div className="h-8 bg-gray-200 rounded-full w-18"></div>
            </div>

            {/* Add skills form skeleton */}
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
              <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton; 