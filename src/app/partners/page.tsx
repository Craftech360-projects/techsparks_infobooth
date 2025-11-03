'use client';

import PageHeader from '@/components/PageHeader';
import { useState, useEffect, useRef } from 'react';

export default function PartnersPage() {
  const [thumbPosition, setThumbPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Handle scroll
  useEffect(() => {
    const content = contentRef.current;
    const track = trackRef.current;
    if (!content || !track) return;

    const updateThumbPosition = () => {
      const scrollPercentage = content.scrollTop / (content.scrollHeight - content.clientHeight);
      const trackHeight = track.clientHeight;
      const maxThumbPosition = trackHeight - 60;
      setThumbPosition(scrollPercentage * maxThumbPosition);
    };

    content.addEventListener('scroll', updateThumbPosition);
    return () => content.removeEventListener('scroll', updateThumbPosition);
  }, []);

  // Handle thumb drag
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !contentRef.current || !trackRef.current) return;

      const trackRect = trackRef.current.getBoundingClientRect();
      const newPosition = Math.min(Math.max(0, e.clientY - trackRect.top - 30), trackRect.height - 60);
      setThumbPosition(newPosition);

      const scrollPercentage = newPosition / (trackRect.height - 60);
      const content = contentRef.current;
      content.scrollTop = scrollPercentage * (content.scrollHeight - content.clientHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className="h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage: "url(/images/white_red_background.png)" }}
    >
      {/* Custom Scrollbar Track */}
      <div
        ref={trackRef}
        className="fixed right-16 top-28 bottom-16 w-[18px] bg-[#D9D9D9]/10 border z-50"
        style={{ borderColor: '#FF0000' }}
      >
        {/* Custom Scrollbar Thumb */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-[32px] h-[60px] cursor-grab active:cursor-grabbing"
          style={{
            top: `${thumbPosition}px`,
            transition: isDragging ? 'none' : 'top 0.1s ease-out',
            backgroundColor: '#FF0000'
          }}
          onMouseDown={handleMouseDown}
        />
      </div>

      {/* Scrollable Content */}
      <div ref={contentRef} className="h-full overflow-y-auto scrollbar-hide">
        <PageHeader title="PARTNERS" theme="light" />

        <div className="px-32 pb-8">
          {/* Partners Image */}
          <div className="mt-8">
            <img
              src="/images/partners_image.png"
              alt="Partners and Sponsors"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
