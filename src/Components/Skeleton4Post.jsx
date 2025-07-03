import React from 'react';
import '../SkeletonLoader.css';  // CSS for shimmer effect

function Skeleton4Post() {
  return (
    <div className='border-2 border-gray-200 p-1 rounded-md lg:w-[70%] w-full mx-auto my-4'>
      
    {/* Header Skeleton */}
    <div className="flex px-2 justify-between items-center border-b-2 border-gray-100 pb-2 mb-2">
      <div className="flex gap-1 items-center py-2">
        {/* User Avatar Skeleton */}
        <div className="relative w-8 h-8 rounded-full skeleton"></div>
        <div className="ml-2">
          <span className="skeleton skeleton-text"></span> {/* Name skeleton */}
          <div className="skeleton skeleton-text short"></div> {/* Time skeleton */}
        </div>
      </div>
      <div className="skeleton skeleton-icon"></div> {/* Menu icon skeleton */}
    </div>

    {/* Title Skeleton */}
    <div className="skeleton skeleton-text"></div>

    {/* Image/Video Skeleton */}
    <div className="w-full h-[300px] skeleton"></div>

    {/* Note Skeleton */}
    <div className="skeleton skeleton-text"></div>

    {/* Footer Buttons Skeleton */}
    <div className="mt-2 px-2 flex items-center justify-between">
      <div className="w-[32%] h-[50px] skeleton"></div>
      <div className="w-[32%] h-[50px] skeleton"></div>
      <div className="w-[32%] h-[50px] skeleton"></div>
    </div>
  </div>
);
}

export default Skeleton4Post;
