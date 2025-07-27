import React from 'react';

const JobCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 animate-pulse">
      {/* Header with logo and company */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Company logo skeleton */}
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          <div className="flex-1">
            {/* Company name skeleton */}
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            {/* Location skeleton */}
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
        {/* Posted date skeleton */}
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>

      {/* Job title skeleton */}
      <div className="mb-3">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      {/* Job details skeleton */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-4">
          <div className="h-3 bg-gray-200 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="h-3 bg-gray-200 rounded w-12"></div>
          <div className="h-3 bg-gray-200 rounded w-18"></div>
        </div>
      </div>

      {/* Skills skeleton */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          <div className="h-6 bg-gray-200 rounded-full w-14"></div>
        </div>
      </div>

      {/* Salary and apply button skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
      </div>
    </div>
  );
};

export default JobCardSkeleton; 