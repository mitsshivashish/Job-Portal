import React from 'react';

const NavbarSkeleton = () => {
  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo skeleton */}
          <div className="flex items-center">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
          </div>

          {/* Desktop navigation skeleton */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-14"></div>
            <div className="h-4 bg-gray-200 rounded w-18"></div>
          </div>

          {/* User menu skeleton */}
          <div className="flex items-center space-x-4">
            <div className="h-8 bg-gray-200 rounded w-20"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>

          {/* Mobile menu button skeleton */}
          <div className="md:hidden">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarSkeleton; 