"use client";

import PageHeader from "@/components/PageHeader";
import { useState, useEffect, useRef } from "react";

interface Speaker {
  name: string;
  designation: string;
}

interface Session {
  start_time: string;
  end_time: string;
  session_duration: string;
  stage: string;
  program: string;
  title: string;
  description: string;
  speaker?: Speaker | Speaker[];
  speakers?: Speaker[];
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
    { id: "aura", label: "Aura - Main Stage" },
    { id: "harmony", label: "Harmony - Focus Stage" },
    { id: "azure", label: "Azure - Masterclass Stage" },
  ];

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const dayNumber = selectedDay.replace("day", "");
        // Capitalize first letter of hall name to match file naming
        const hallName = selectedHall.charAt(0).toUpperCase() + selectedHall.slice(1);
        const res = await fetch(
          `/data/agenda/Day_${dayNumber}_agenda_${hallName}.json`
        );
        const data = await res.json();
        setSessions(data);
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
        className="fixed right-43 top-62 bottom-28 w-[18px] bg-[#D9D9D9]/10 border border-white z-50"
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
                className="relative transition-colors duration-300"
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
                  fontSize: "30px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxSizing: "border-box",
                  borderRadius: selectedDay === day.id ? "10px" : "6px",
                }}
              >
                {day.label}
              </button>
            ))}
          </div>

          {/* Hall Buttons */}
          <div className="flex gap-4 mb-10">
            {halls.map((hall) => (
                <button
                  key={hall.id}
                  onClick={() => setSelectedHall(hall.id)}
                  className="relative font-medium transition-colors duration-300"
                  style={{
                    backgroundImage:
                      selectedHall === hall.id
                        ? "none"
                        : "url(/images/button_frame.png)",
                    backgroundColor:
                      selectedHall === hall.id ? "#FF0000" : "transparent",
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    width: "340px",
                    height: "70px",
                    minWidth: "340px",
                    maxWidth: "340px",
                    minHeight: "70px",
                    maxHeight: "70px",
                    color: "#FFFFFF",
                    fontSize: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxSizing: "border-box",
                    borderRadius: selectedHall === hall.id ? "10px" : "6px",
                  }}
                >
                  {hall.label}
                </button>
            ))}
          </div>

          {/* Timeline and Sessions */}
          {sessions.length > 0 && (
            <div className="relative">
              {/* Sessions */}
              <div className="space-y-8 mr-52">
                {sessions.map((session, index) => {
                  // Skip empty or header rows
                  if (!session.program || session.start_time === "From") {
                    return null;
                  }

                  const timeFrom = session.start_time.substring(0, 5);
                  const timeTo = session.end_time.substring(0, 5);

                  // Handle speakers (array), speaker (object), and speaker (array) formats
                  let speakersList: Speaker[] = [];
                  if (session.speakers) {
                    speakersList = session.speakers;
                  } else if (session.speaker) {
                    // Check if speaker is an array or object
                    if (Array.isArray(session.speaker)) {
                      speakersList = session.speaker;
                    } else if (session.speaker.name) {
                      speakersList = [session.speaker];
                    }
                  }

                  return (
                    <div
                      key={index}
                      className="relative rounded-lg p-[2px]"
                      style={{
                        background:
                          "linear-gradient(to right, #ff0000, #FFFFFF)",
                      }}
                    >
                      <div
                        className="relative rounded-lg p-6 backdrop-blur-sm"
                        style={{
                          backgroundColor: "rgb(0, 0, 0)",
                        }}
                      >
                        {/* Session Content */}
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            {/* Program - bold */}
                            <h3
                              className="font-bold"
                              style={{ color: "#FFFFFF", fontSize: "30px" }}
                            >
                              {session.program}
                            </h3>

                            {/* Title - bold */}
                            {session.title && (
                              <h4
                                className="font-bold mt-2"
                                style={{ color: "#FFFFFF", fontSize: "30px" }}
                              >
                                {session.title}
                              </h4>
                            )}

                            {/* Description - regular */}
                            {session.description && (
                              <p
                                className="mt-2"
                                style={{
                                  color: "#FFFFFF",
                                  fontSize: "26px",
                                  fontWeight: "400",
                                  lineHeight: "1.4"
                                }}
                              >
                                {session.description}
                              </p>
                            )}

                            {/* Speakers section with gap */}
                            {speakersList.length > 0 && (
                              <div className="mt-6">
                                {speakersList.map((speaker, idx) => (
                                  <p
                                    key={idx}
                                    className="mb-2"
                                    style={{ color: "#FFFFFF", fontSize: "26px" }}
                                  >
                                    {/* Speaker name - bold */}
                                    <span className="font-bold">{speaker.name}</span>
                                    {/* Speaker designation - regular in brackets */}
                                    {speaker.designation && (
                                      <span style={{ fontWeight: "400" }}>
                                        {" "}({speaker.designation})
                                      </span>
                                    )}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Time */}
                          <div className="text-right ml-4">
                            <div
                              className="font-bold whitespace-nowrap"
                              style={{ color: "#FFFFFF", fontSize: "28px" }}
                            >
                              {timeFrom} - {timeTo}
                            </div>
                            <div
                              className="italic"
                              style={{ color: "#FFFFFF", fontSize: "24px" }}
                            >
                              ({session.session_duration} mins)
                            </div>
                          </div>
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
