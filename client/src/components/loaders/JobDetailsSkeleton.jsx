import React from 'react';

const JobDetailsSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Back button skeleton */}
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded w-24"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Job details skeleton */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Header skeleton */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div>
                    <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>

            {/* Job info skeleton */}
            <div className="grid grid-cols-2 gap-4 mb-6">
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
                <div className="h-3 bg-gray-200 rounded w-18 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>

            {/* Description skeleton */}
            <div className="mb-6">
              <div className="h-5 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>

            {/* Skills skeleton */}
            <div>
              <div className="h-5 bg-gray-200 rounded w-20 mb-4"></div>
              <div className="flex flex-wrap gap-2">
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                <div className="h-6 bg-gray-200 rounded-full w-14"></div>
                <div className="h-6 bg-gray-200 rounded-full w-18"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Application form skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
            <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
            
            <div className="space-y-4">
              <div>
                <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-12 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-14 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-18 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
              </div>
              <div className="pt-4">
                <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsSkeleton; 