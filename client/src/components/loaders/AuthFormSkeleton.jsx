import React from 'react';

const AuthFormSkeleton = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header skeleton */}
        <div className="text-center">
          <div className="h-8 bg-gray-200 rounded w-32 mx-auto mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
        </div>

        {/* Form skeleton */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-pulse">
          <div className="space-y-6">
            {/* Name field skeleton */}
            <div>
              <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
            </div>

            {/* Email field skeleton */}
            <div>
              <div className="h-4 bg-gray-200 rounded w-12 mb-2"></div>
              <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
            </div>

            {/* Password field skeleton */}
            <div>
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
            </div>

            {/* Role field skeleton */}
            <div>
              <div className="h-4 bg-gray-200 rounded w-10 mb-2"></div>
              <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
            </div>

            {/* Submit button skeleton */}
            <div className="pt-4">
              <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
            </div>

            {/* Divider skeleton */}
            <div className="relative my-6">
              <div className="h-px bg-gray-200"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>

            {/* Google OAuth button skeleton */}
            <div className="h-12 bg-gray-200 rounded-lg w-full"></div>

            {/* Link skeleton */}
            <div className="text-center">
              <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthFormSkeleton; 