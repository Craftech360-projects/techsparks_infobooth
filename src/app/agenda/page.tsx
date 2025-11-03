"use client";

import PageHeader from "@/components/PageHeader";
import { useState, useEffect, useRef } from "react";

interface Session {
  Day: string;
  Venue: string;
  "Session format": string;
  "Session type": string;
  "Session Name": string;
  Moderator: string;
  "Session duration (mins)": string;
  "Session Time From (IST)": string;
  "Session Time To (IST)": string;
}

export default function AgendaPage() {
  const [selectedDay, setSelectedDay] = useState("day1");
  const [selectedHall, setSelectedHall] = useState("aura");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [thumbPosition, setThumbPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const days = [
    { id: "day1", label: "Nov 06" },
    { id: "day2", label: "Nov 07" },
    { id: "day3", label: "Nov 08" },
  ];

  const halls = [
    { id: "aura", label: "Aura Hall" },
    { id: "harmony", label: "Harmony Hall" },
    { id: "azure", label: "Azure Hall" },
    { id: "strategy", label: "Strategy Hall" },
    { id: "others", label: "Others" },
  ];

  // Check if Strategy hall is available for the selected day
  const isStrategyAvailable = selectedDay === "day2";

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        if (selectedHall === "others") {
          // Fetch and combine data from Boardroom, Paranda, and Poolside
          const venues = ["boardroom", "paranda", "poolside"];
          const fetchPromises = venues.map((venue) =>
            fetch(`/data/agenda/${selectedDay}-${venue}.json`)
              .then((res) => (res.ok ? res.json() : []))
              .catch(() => [])
          );

          const results = await Promise.all(fetchPromises);
          const combinedSessions = results.flat();

          // Sort by time
          combinedSessions.sort((a, b) => {
            const timeA = a["Session Time From (IST)"];
            const timeB = b["Session Time From (IST)"];
            return timeA.localeCompare(timeB);
          });

          setSessions(combinedSessions);
        } else {
          // Fetch single venue data
          const res = await fetch(`/data/agenda/${selectedDay}-${selectedHall}.json`);
          const data = await res.json();
          setSessions(data);
        }
      } catch (error) {
        console.error("Error loading agenda:", error);
        setSessions([]);
      }
    };

    fetchSessions();
  }, [selectedDay, selectedHall]);

  // Handle scroll
  useEffect(() => {
    const content = contentRef.current;
    const track = trackRef.current;
    if (!content || !track) return;

    const updateThumbPosition = () => {
      const scrollPercentage =
        content.scrollTop / (content.scrollHeight - content.clientHeight);
      const trackHeight = track.clientHeight;
      const maxThumbPosition = trackHeight - 60; // 60px is thumb height
      setThumbPosition(scrollPercentage * maxThumbPosition);
    };

    content.addEventListener("scroll", updateThumbPosition);
    return () => content.removeEventListener("scroll", updateThumbPosition);
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
      const newPosition = Math.min(
        Math.max(0, e.clientY - trackRect.top - 30),
        trackRect.height - 60
      );
      setThumbPosition(newPosition);

      const scrollPercentage = newPosition / (trackRect.height - 60);
      const content = contentRef.current;
      content.scrollTop =
        scrollPercentage * (content.scrollHeight - content.clientHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
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
        className="fixed right-16 top-28 bottom-16 w-[18px] bg-[#D9D9D9]/10 border border-white z-50"
      >
        {/* Custom Scrollbar Thumb */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-[32px] h-[60px] cursor-grab active:cursor-grabbing"
          style={{
            top: `${thumbPosition}px`,
            transition: isDragging ? "none" : "top 0.1s ease-out",
            backgroundColor: "#FF0000",
          }}
          onMouseDown={handleMouseDown}
        />
      </div>

      {/* Scrollable Content */}
      <div ref={contentRef} className="h-full overflow-y-auto scrollbar-hide">
        <PageHeader title="AGENDA" theme="dark" />

        <div className="px-32 pb-8">
          {/* Day Buttons */}
          <div className="flex gap-4 mb-6 mt-8">
            {days.map((day) => (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className="relative transition-colors duration-300 rounded-lg"
                style={{
                  backgroundImage:
                    selectedDay === day.id
                      ? "none"
                      : "url(/images/button_frame.png)",
                  backgroundColor:
                    selectedDay === day.id ? "#FF0000" : "transparent",
                  backgroundSize: "100% 100%",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  width: "180px",
                  height: "70px",
                  minWidth: "180px",
                  maxWidth: "180px",
                  minHeight: "70px",
                  maxHeight: "70px",
                  color: "#FFFFFF",
                  fontSize: "26px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxSizing: "border-box",
                  borderRadius: "16px"
                }}
              >
                {day.label}
              </button>
            ))}
          </div>

          {/* Hall Buttons */}
          <div className="flex gap-4 mb-8">
            {halls.map((hall) => {
              const isDisabled = hall.id === "strategy" && !isStrategyAvailable;
              return (
                <button
                  key={hall.id}
                  onClick={() => !isDisabled && setSelectedHall(hall.id)}
                  disabled={isDisabled}
                  className={`relative px-6 py-3 text-2xl font-medium transition-colors duration-300 ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
                  style={{
                    backgroundImage:
                      selectedHall === hall.id
                        ? "none"
                        : "url(/images/button_frame.png)",
                    backgroundColor:
                      selectedHall === hall.id ? "#FF0000" : "transparent",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    minWidth: "180px",
                    borderRadius: selectedHall === hall.id ? "16px" : "16px",
                    color: "#FFFFFF",
                  }}
                >
                  {hall.label}
                </button>
              );
            })}
          </div>

          {/* Timeline and Sessions */}
          {sessions.length > 0 && (
            <div className="relative">
              {/* Sessions */}
              <div className="space-y-8 mr-52">
                {sessions.map((session, index) => {
                  const timeFrom = session["Session Time From (IST)"].substring(0, 5);
                  const timeTo = session["Session Time To (IST)"].substring(0, 5);

                  return (
                    <div
                      key={index}
                      className="relative rounded-lg p-[2px]"
                      style={{
                        background: "linear-gradient(to right, #ff0000, #FFFFFF)",
                      }}
                    >
                      <div
                        className="relative rounded-lg p-6 backdrop-blur-sm"
                        style={{
                          backgroundColor: "rgb(0, 0, 0)",
                        }}
                      >
                        {/* Session Content */}
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3
                                className="text-2xl font-bold"
                                style={{ color: "#FFFFFF" }}
                              >
                                {session["Session Name"]}
                              </h3>

                              {/* Session Format Badge */}
                              {/* <span
                                className="px-3 py-1 rounded text-sm font-medium"
                                style={{
                                  backgroundColor: "#FF0000",
                                  color: "#FFFFFF",
                                }}
                              > */}
                                {/* {session["Session format"]} */}
                              {/* </span> */}

                              {/* Venue Badge (only for Others view) */}
                              {selectedHall === "others" && (
                                <span
                                  className="px-3 py-1 rounded text-sm font-medium"
                                  style={{
                                    backgroundColor: "#FFFFFF",
                                    color: "#000000",
                                  }}
                                >
                                  {session.Venue}
                                </span>
                              )}
                            </div>

                            {/* Moderator */}
                            {session.Moderator && session.Moderator !== "nan" && (
                              <p
                                className="text-sm italic"
                                style={{ color: "#FFFFFF" }}
                              >
                                Moderator: {session.Moderator}
                              </p>
                            )}
                          </div>

                          {/* Time */}
                          <div className="text-right ml-4">
                            <div
                              className="text-xl font-bold whitespace-nowrap"
                              style={{ color: "#FFFFFF" }}
                            >
                              {timeFrom} - {timeTo}
                            </div>
                            <div
                              className="text-sm italic"
                              style={{ color: "#FFFFFF" }}
                            >
                              ({session["Session duration (mins)"]} mins)
                            </div>
                          </div>
                        </div>

                        {/* Session Type */}
                        <div className="text-sm" style={{ color: "#ffffffff"}}>
                          {session["Session type"]}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
