import React, { useState } from "react";
import { motion } from "framer-motion";

export default function CourtCard({ court }) {
  const {
    CourtType,
    court_type_en,
    SurfaceType,
    Neighborhood,
    Street,
    StreetNumber,
    Distance,
    Address,
    Lighting,
    ImageUrl,
    Latitude,
    Longitude,
  } = court;
  
  const [expanded, setExpanded] = useState(false);

  // Feature tags
  const featureTags = [];
  if (CourtType?.toLowerCase().includes("כדורגל")) featureTags.push("שערים");
  if (CourtType?.toLowerCase().includes("כדורסל")) featureTags.push("סלים");
  if (Lighting) featureTags.push("תאורה");

  // Normalize & capitalize helpers
  const getIcon = (type = "") => {
    const normalized = type.trim().toLowerCase();
    switch (normalized) {
      case "basketball court":
        return "🏀";
      case "football court":
        return "⚽";
      case "volleyball court":
        return "🏐";
      case "multi-purpose court":
        return "🏟️";
      default:
        return "❓";
    }
  };
  const capitalizeLabel = (str = "") =>
    str
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  // Color tag for Hebrew court type
  const typeColor = CourtType?.includes("כדורסל")
    ? "bg-orange-100 text-orange-700"
    : CourtType?.includes("כדורגל")
    ? "bg-green-100 text-green-700"
    : "bg-gray-100 text-gray-700";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-md overflow-hidden flex flex-row-reverse max-w-2xl w-full mx-auto text-right"
    >
      {/* Image with Distance */}
      <div className="relative w-1/3 h-40 min-w-[120px]">
        <img
          src={ImageUrl || "/placeholder.jpg"}
          alt="מגרש"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded bg-opacity-70">
          {Distance?.toFixed(1)} ק״מ
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between p-4 w-2/3 space-y-2">
        {/* Type + Title */}
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-bold leading-tight flex items-center gap-2">
            {capitalizeLabel(CourtType)} {getIcon(CourtType)}
          </h2>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 text-xs">
          {featureTags.map((tag, i) => (
            <span key={i} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 justify-start mt-2 flex-wrap">
          <button
            className="border border-gray-400 text-sm px-3 py-1 rounded hover:bg-gray-100 flex items-center gap-1"
            onClick={() => setExpanded(!expanded)}
          >
            ℹ️ פרטים
          </button>

          <a
            href={`https://waze.com/ul?ll=${Latitude},${Longitude}&navigate=yes`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
          >
            🚗 Waze
          </a>

          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${Latitude},${Longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600 flex items-center gap-1"
          >
            🗺️ Google
          </a>
        </div>

        {/* Expandable info */}
        {expanded && (
          <div className="text-sm text-gray-700 space-y-1 border-t pt-2 mt-2">
            <div>🧭 כתובת: {Address || "לא זמינה"}</div>
            <div>📌 רחוב: {Street} {StreetNumber}</div>
            <div>🏙️ שכונה: {Neighborhood}</div>
            <div>🌍 קואורדינטות: {Latitude}, {Longitude}</div>
            <div>🧱 משטח: {SurfaceType || "לא ידוע"}</div>
            <div>💡 תאורה: {Lighting ? "כן" : "לא ידוע"}</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
