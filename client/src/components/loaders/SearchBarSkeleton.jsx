import React from 'react';

const SearchBarSkeleton = () => {
  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="relative">
        {/* Main search input skeleton */}
        <div className="w-full h-14 bg-gray-200 rounded-full animate-pulse"></div>
        
        {/* Search icon skeleton */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
        </div>
        
        {/* Filter icon skeleton */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
        </div>
      </div>
      
      {/* Search suggestions skeleton */}
      <div className="mt-2 flex flex-wrap gap-2 justify-center">
        <div className="h-8 bg-gray-200 rounded-full w-20 animate-pulse"></div>
        <div className="h-8 bg-gray-200 rounded-full w-24 animate-pulse"></div>
        <div className="h-8 bg-gray-200 rounded-full w-16 animate-pulse"></div>
        <div className="h-8 bg-gray-200 rounded-full w-22 animate-pulse"></div>
      </div>
    </div>
  );
};

export default SearchBarSkeleton; 