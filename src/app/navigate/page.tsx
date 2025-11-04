'use client';

import PageHeader from '@/components/PageHeader';
import { useState, useEffect, useRef } from 'react';

export default function NavigatePage() {
  const [selectedHall, setSelectedHall] = useState('aura');
  const [scale, setScale] = useState(0.15);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const contentRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const halls = [
    { id: 'aura', label: 'Aura Hall', map: '/images/maps/aura-hall.png' },
    { id: 'harmony', label: 'Harmony Hall', map: '/images/maps/harmony-hall.png' },
    { id: 'azure', label: 'Azure Hall', map: '/images/maps/azure-hall.png' },
    { id: 'strategy', label: 'Strategy Hall', map: '/images/maps/strategy-hall.png' },
  ];

  // Zoom functions
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.05, 0.1));
  };

  // Pan functions
  const handleMouseDownMap = (e: React.MouseEvent) => {
    setIsPanning(true);
    setPanStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    const handleMouseMoveMap = (e: MouseEvent) => {
      if (!isPanning) return;

      setPosition({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    };

    const handleMouseUpMap = () => {
      setIsPanning(false);
    };

    if (isPanning) {
      document.addEventListener('mousemove', handleMouseMoveMap);
      document.addEventListener('mouseup', handleMouseUpMap);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMoveMap);
      document.removeEventListener('mouseup', handleMouseUpMap);
    };
  }, [isPanning, panStart]);

  // Reset zoom and position when hall changes
  useEffect(() => {
    setScale(0.15);
    setPosition({ x: 0, y: 0 });
  }, [selectedHall]);

  return (
    <div
      className="h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage: "url(/images/white_red_background.png)" }}
    >
      {/* Scrollable Content */}
      <div ref={contentRef} className="h-full overflow-y-auto scrollbar-hide flex flex-col">
        <PageHeader title="NAVIGATE" theme="light" />

        {/* Main Content Area */}
        <div className="flex-1 flex gap-8 justify-center items-start px-32 pt-12">
            {/* Left Side - Hall Buttons */}
            <div className="flex flex-col gap-6">
              {halls.map((hall) => (
                <button
                  key={hall.id}
                  onClick={() => setSelectedHall(hall.id)}
                  className="relative transition-colors duration-300 rounded-lg"
                  style={{
                    backgroundImage: selectedHall === hall.id ? 'none' : "url(/images/button_frame.png)",
                    backgroundColor: selectedHall === hall.id ? '#FF0000' : 'transparent',
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    width: '350px',
                    height: '80px',
                    minWidth: '350px',
                    maxWidth: '350px',
                    minHeight: '80px',
                    maxHeight: '80px',
                    color: selectedHall === hall.id ? 'white' : 'black',
                    fontSize: '30px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxSizing: 'border-box',
                    borderRadius: '16px'
                  }}
                >
                  {hall.label}
                </button>
              ))}
            </div>

            {/* Right Side - Map Viewer */}
            <div className="relative border-2 border-black rounded-lg overflow-hidden bg-white" style={{ width: '1800px', height: '900px' }}>
              {/* Map Container */}
              <div
                ref={imageContainerRef}
                className="w-full h-full overflow-hidden relative cursor-move"
                onMouseDown={handleMouseDownMap}
              >
                <img
                  src={halls.find((h) => h.id === selectedHall)?.map}
                  alt={`${halls.find((h) => h.id === selectedHall)?.label} Map`}
                  className="absolute top-1/2 left-1/2 max-w-none"
                  style={{
                    transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`,
                    transformOrigin: 'center',
                    transition: isPanning ? 'none' : 'transform 0.2s ease-out',
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                  draggable={false}
                />
              </div>

              {/* Zoom Controls */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <button
                  onClick={handleZoomIn}
                  className="w-12 h-12 border-2 rounded-lg flex items-center justify-center transition-colors"
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    backgroundColor: '#FF0000',
                    borderColor: '#FF0000',
                    color: '#FFFFFF'
                  }}
                >
                  +
                </button>
                <button
                  onClick={handleZoomOut}
                  className="w-12 h-12 border-2 rounded-lg flex items-center justify-center transition-colors"
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    backgroundColor: '#FF0000',
                    borderColor: '#FF0000',
                    color: '#FFFFFF'
                  }}
                >
                  −
                </button>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
