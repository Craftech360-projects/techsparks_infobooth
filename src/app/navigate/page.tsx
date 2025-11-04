'use client';

import PageHeader from '@/components/PageHeader';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function NavigatePage() {
  const [selectedHall, setSelectedHall] = useState('aura');

  // Image dimensions (actual size from the files)
  const IMAGE_WIDTH = 9362;
  const IMAGE_HEIGHT = 6623;
  const CONTAINER_WIDTH = 1300;
  const CONTAINER_HEIGHT = 700;

  // Calculate initial scale to fit image in container
  const calculateInitialScale = () => {
    const scaleX = CONTAINER_WIDTH / IMAGE_WIDTH;
    const scaleY = CONTAINER_HEIGHT / IMAGE_HEIGHT;
    return Math.min(scaleX, scaleY) * 0.9; // 0.9 for a bit of padding
  };

  const INITIAL_SCALE = calculateInitialScale();
  const MIN_SCALE = INITIAL_SCALE;
  const MAX_SCALE = 2;

  const [scale, setScale] = useState(INITIAL_SCALE);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [touchDistance, setTouchDistance] = useState<number | null>(null);
  const [lastTap, setLastTap] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const halls = [
    { id: 'aura', label: 'Aura Hall', map: '/images/maps/aura-hall.png' },
    { id: 'harmony', label: 'Harmony Hall', map: '/images/maps/harmony-hall.png' },
    { id: 'azure', label: 'Azure Hall', map: '/images/maps/azure-hall.png' },
    { id: 'strategy', label: 'Strategy Hall', map: '/images/maps/strategy-hall.png' },
  ];

  // Helper function to constrain scale
  const constrainScale = (newScale: number) => {
    return Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
  };

  // Zoom functions
  const handleZoomIn = () => {
    setScale((prev) => constrainScale(prev * 1.2));
  };

  const handleZoomOut = () => {
    setScale((prev) => constrainScale(prev / 1.2));
  };

  // Reset view to initial state
  const handleResetView = () => {
    setScale(INITIAL_SCALE);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => constrainScale(prev * delta));
  };

  // Calculate distance between two touch points
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Start pinch zoom
      e.preventDefault();
      const distance = getTouchDistance(e.touches);
      setTouchDistance(distance);
      setIsPanning(false);
    } else if (e.touches.length === 1) {
      // Check for double tap
      const currentTime = Date.now();
      const tapLength = currentTime - lastTap;
      if (tapLength < 300 && tapLength > 0) {
        // Double tap detected
        e.preventDefault();
        handleDoubleTap(e.touches[0].clientX, e.touches[0].clientY);
      } else {
        // Start panning
        setIsPanning(true);
        setPanStart({
          x: e.touches[0].clientX - position.x,
          y: e.touches[0].clientY - position.y,
        });
      }
      setLastTap(currentTime);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchDistance !== null) {
      // Pinch zoom
      e.preventDefault();
      const newDistance = getTouchDistance(e.touches);
      const scaleChange = newDistance / touchDistance;
      setScale((prev) => constrainScale(prev * scaleChange));
      setTouchDistance(newDistance);
    } else if (e.touches.length === 1 && isPanning) {
      // Pan
      e.preventDefault();
      setPosition({
        x: e.touches[0].clientX - panStart.x,
        y: e.touches[0].clientY - panStart.y,
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      setTouchDistance(null);
      setIsPanning(false);
    } else if (e.touches.length === 1) {
      // Continue panning with one finger after pinch
      setTouchDistance(null);
      setIsPanning(true);
      setPanStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  // Double tap to zoom
  const handleDoubleTap = (_clientX: number, _clientY: number) => {
    if (scale > INITIAL_SCALE * 1.5) {
      // Zoom out to fit
      setScale(INITIAL_SCALE);
      setPosition({ x: 0, y: 0 });
    } else {
      // Zoom in
      setScale((prev) => constrainScale(prev * 2));
    }
  };

  // Mouse pan functions
  const handleMouseDownMap = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPanning(true);
    setPanStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    const handleMouseMoveMap = (e: MouseEvent) => {
      if (!isPanning) return;
      e.preventDefault();

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
    setScale(INITIAL_SCALE);
    setPosition({ x: 0, y: 0 });
  }, [selectedHall, INITIAL_SCALE]);

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
            <div className="relative border-2 border-black rounded-lg overflow-hidden bg-white" style={{ width: '1300px', height: '700px' }}>
              {/* Map Container */}
              <div
                ref={imageContainerRef}
                className="w-full h-full overflow-hidden relative"
                style={{ cursor: isPanning ? 'grabbing' : 'grab', touchAction: 'none' }}
                onMouseDown={handleMouseDownMap}
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="absolute top-1/2 left-1/2"
                  style={{
                    transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`,
                    transformOrigin: 'center',
                    transition: isPanning || touchDistance !== null ? 'none' : 'transform 0.2s ease-out',
                    width: `${IMAGE_WIDTH}px`,
                    height: `${IMAGE_HEIGHT}px`,
                  }}
                >
                  <Image
                    src={halls.find((h) => h.id === selectedHall)?.map || ''}
                    alt={`${halls.find((h) => h.id === selectedHall)?.label} Map`}
                    width={IMAGE_WIDTH}
                    height={IMAGE_HEIGHT}
                    quality={85}
                    priority
                    sizes="(max-width: 1300px) 100vw, 1300px"
                    className="object-contain"
                    style={{
                      userSelect: 'none',
                      pointerEvents: 'none',
                    }}
                    draggable={false}
                  />
                </div>
              </div>

              {/* Zoom Controls */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <button
                  onClick={handleZoomIn}
                  className="w-12 h-12 border-2 rounded-lg flex items-center justify-center transition-colors hover:opacity-90"
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    backgroundColor: '#FF0000',
                    borderColor: '#FF0000',
                    color: '#FFFFFF'
                  }}
                  title="Zoom In"
                >
                  +
                </button>
                <button
                  onClick={handleZoomOut}
                  className="w-12 h-12 border-2 rounded-lg flex items-center justify-center transition-colors hover:opacity-90"
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    backgroundColor: '#FF0000',
                    borderColor: '#FF0000',
                    color: '#FFFFFF'
                  }}
                  title="Zoom Out"
                >
                  −
                </button>
                <button
                  onClick={handleResetView}
                  className="w-12 h-12 border-2 rounded-lg flex items-center justify-center transition-colors hover:opacity-90"
                  style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    backgroundColor: '#FF0000',
                    borderColor: '#FF0000',
                    color: '#FFFFFF'
                  }}
                  title="Reset View"
                >
                  ⟲
                </button>
              </div>

              {/* Zoom Level Indicator */}
              <div
                className="absolute bottom-4 left-4 px-3 py-1 rounded-lg"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {Math.round((scale / INITIAL_SCALE) * 100)}%
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}