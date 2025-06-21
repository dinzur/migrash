import { useState } from "react";
import { motion } from "framer-motion";

export default function CourtCard({ court }) {
  const {
    CourtType,
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
    Availability,
    Affiliation,
    Description,
    City,
  } = court;

  const [expanded, setExpanded] = useState(false);

  const getCourtBadge = (type = "") => {
    const t = type.toLowerCase();
    if (t.includes("כדורגל")) return { icon: "⚽", bg: "bg-green-100", textColor: "text-green-700" };
    if (t.includes("כדורסל")) return { icon: "🏀", bg: "bg-orange-100", textColor: "text-orange-700" };
    if (t.includes("כדורעף")) return { icon: "🏐", bg: "bg-purple-100", textColor: "text-purple-700" };
    if (t.includes("משולב")) return { icon: "🏟️", bg: "bg-blue-100", textColor: "text-blue-700" };
    return { icon: "❓", bg: "bg-gray-200", textColor: "text-gray-700" };
  };

  const badge = getCourtBadge(CourtType || "");

  const featureTags = [];
  if (CourtType?.includes("כדורגל")) featureTags.push("שערים");
  if (CourtType?.includes("כדורסל")) featureTags.push("סלים");
  if (Lighting) featureTags.push("תאורה");

  const getDistanceStyle = (distance) => {
    if (distance < 1) return "bg-green-100 text-green-700";
    if (distance < 3) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden flex max-w-2xl w-full mx-auto text-right"
    >
      {/* Info block */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        {/* Title with icon before & after */}
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-lg px-2 py-1 rounded-full ${badge.bg} ${badge.textColor}`}>
            {badge.icon}
          </span>
          <h3 className="text-lg font-bold">{CourtType || "מגרש"}</h3>
          <span className={`text-lg ${badge.textColor}`}>{badge.icon}</span>
        </div>

        {/* Feature tags */}
        <div className="flex flex-wrap gap-2 mt-2">
          {featureTags.map((tag, idx) => (
            <span key={idx} className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Distance + Expand button */}
        <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
          {Distance !== undefined && (
            <span className={`text-sm font-medium flex items-center gap-1 px-3 py-1 rounded-full ${getDistanceStyle(Distance)}`}>
              📍 {Distance.toFixed(1)} ק״מ
            </span>
          )}
          <button
            className="border border-gray-400 text-sm px-4 py-1 rounded-full hover:bg-gray-100"
            onClick={() => setExpanded(!expanded)}
          >
            ℹ️ פרטים
          </button>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="mt-4 text-sm text-gray-700 space-y-3 border-t pt-3">
            <div>📍 <b>כתובת:</b> {Address || `${Street || ""} ${StreetNumber || ""}, ${City || ""}`}</div>
            <div>📝 <b>תיאור:</b> {Description || "לא ידוע"}</div>
            <div>
              🌍 <b>קואורדינטות:</b>{" "}
              {Latitude && Longitude ? `${Latitude}, ${Longitude}` : "לא ידוע"}
            </div>
            <div>🧱 <b>משטח:</b> {SurfaceType || "לא ידוע"}</div>
            <div>💡 <b>תאורה:</b> {Lighting ? "כן" : "לא ידוע"}</div>
            <div>📆 <b>זמינות:</b> {Availability || "לא ידוע"}</div>
            <div>🏫 <b>שיוך:</b> {Affiliation || "לא ידוע"}</div>

            {/* Navigation */}
            <div className="font-semibold">🧭 ניווט למגרש:</div>
            <div className="flex gap-2">
              <a
                href={`https://waze.com/ul?ll=${Latitude},${Longitude}&navigate=yes`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-indigo-500 text-white text-xs px-3 py-1 rounded hover:bg-indigo-600"
              >
                🚗 Waze
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${Latitude},${Longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600"
              >
                🗺️ Google
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Image block */}
      <div className="relative w-48 h-full min-h-[160px]">
        <img
          src={ImageUrl || "/placeholder.jpg"}
          alt="תמונה של מגרש"
          className="w-full h-full object-cover"
        />
        {Distance !== undefined && (
          <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded-full opacity-80">
            {Distance.toFixed(1)} ק״מ
          </span>
        )}
      </div>
    </motion.div>
  );
}
