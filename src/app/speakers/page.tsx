'use client';

import PageHeader from '@/components/PageHeader';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function SpeakersPage() {
  const [thumbPosition, setThumbPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [speakerImages, setSpeakerImages] = useState<string[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Fetch speaker images from API
  useEffect(() => {
    fetch('/api/speakers')
      .then((res) => res.json())
      .then((data) => {
        setSpeakerImages(data.images);
      })
      .catch((error) => console.error('Error loading speaker images:', error));
  }, []);

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
      style={{ backgroundImage: "url(/images/black_red_background.png)" }}
    >
      {/* Custom Scrollbar Track */}
      <div
        ref={trackRef}
        className="fixed right-43 top-62 bottom-28 w-[18px] bg-[#D9D9D9]/10 border border-white z-50"
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
        <PageHeader title="SPEAKERS" theme="dark" />

        <div className="min-h-screen px-32 pb-8">
          {/* Speakers Grid */}
          <div className="mt-8 mr-52">
            <div className="grid grid-cols-5 gap-0">
              {speakerImages.map((filename, index) => (
                <div
                  key={index}
                  className="relative aspect-square speaker-slide-in opacity-0"
                  style={{
                    animationDelay: `${index * 0.15}s`
                  }}
                >
                  <Image
                    src={`/images/speakers/${filename}`}
                    alt={`Speaker ${filename}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, 20vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slide-in Animation Styles */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .speaker-slide-in {
          animation: slideInUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
