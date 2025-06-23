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
  const [showNavPopup, setShowNavPopup] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const [images, setImages] = useState(
    ImageUrl
      ? [ImageUrl]
      : CourtType?.includes("כדורסל")
      ? ["/images/basketball.jpg"]
      : CourtType?.includes("כדורגל")
      ? ["/images/football.jpg"]
      : ["/placeholder.jpg"]
  );
  const [imageIndex, setImageIndex] = useState(0);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newUrls]);
  };

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
      className="bg-white rounded-xl shadow-lg overflow-hidden flex max-w-2xl w-full mx-auto text-right relative"
    >
      {/* Info Block */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-lg px-2 py-1 rounded-full ${badge.bg} ${badge.textColor}`}>{badge.icon}</span>
          <h3 className="text-lg font-bold">{CourtType || "מגרש"}</h3>
          <span className={`text-lg ${badge.textColor}`}>{badge.icon}</span>
          <motion.button
            onClick={() => setFavorite((prev) => !prev)}
            whileTap={{ scale: 1.4 }}
            transition={{ type: "spring", stiffness: 300 }}
            title="הוספה למועדפים"
          >
            {favorite ? "❤️" : "🤍"}
          </motion.button>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {featureTags.map((tag, idx) => (
            <span key={idx} className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
          {Distance !== undefined && (
            <span className={`text-sm font-medium flex items-center gap-1 px-3 py-1 rounded-full ${getDistanceStyle(Distance)}`}>
              📍 {Distance.toFixed(1)} ק״מ
            </span>
          )}
          <div className="flex gap-2">
            <button className="border border-gray-400 text-sm px-4 py-1 rounded-full hover:bg-gray-100" onClick={() => setExpanded(!expanded)}>
              ℹ️ פרטים
            </button>
            <button className="border border-indigo-400 text-sm px-4 py-1 rounded-full hover:bg-indigo-50" onClick={() => setShowNavPopup(true)}>
              🧭 ניווט
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 text-sm text-gray-700 space-y-3 border-t pt-3">
            <div>📍 <b>כתובת:</b> {Address || `${Street || ""} ${StreetNumber || ""}, ${City || ""}`}</div>
            <div>📝 <b>תיאור:</b> {Description || "לא ידוע"}</div>
            <div>🌍 <b>קואורדינטות:</b> {Latitude && Longitude ? `${Latitude}, ${Longitude}` : "לא ידוע"}</div>
            <div>🧱 <b>משטח:</b> {SurfaceType || "לא ידוע"}</div>
            <div>💡 <b>תאורה:</b> {Lighting ? "כן" : "לא ידוע"}</div>
            <div>📆 <b>זמינות:</b> {Availability || "לא ידוע"}</div>
            <div>🏫 <b>שיוך:</b> {Affiliation || "לא ידוע"}</div>

            <div className="pt-2">
              <div className="font-semibold mb-2">🧭 ניווט מהיר:</div>
              <div className="flex gap-3 justify-start flex-wrap">
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${Latitude},${Longitude}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-sm px-3 py-1 rounded-full transition">
                  <img src="https://cdn-icons-png.flaticon.com/512/2875/2875433.png" alt="Google Maps" className="w-5 h-5" />
                  Google Maps
                </a>
                <a href={`https://maps.apple.com/?daddr=${Latitude},${Longitude}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-sm px-3 py-1 rounded-full transition">
                  <img src="https://developer.apple.com/assets/elements/icons/maps/maps-96x96_2x.png" alt="Apple Maps" className="w-5 h-5" />
                  Apple Maps
                </a>
                <a href={`https://waze.com/ul?ll=${Latitude},${Longitude}&navigate=yes`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-indigo-100 hover:bg-indigo-200 text-sm px-3 py-1 rounded-full transition">
                  <img src="https://cdn-icons-png.flaticon.com/512/3800/3800071.png" alt="Waze" className="w-5 h-5" />
                  Waze
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 text-sm text-blue-600 underline cursor-pointer">
          <label>
            הוסף תמונות
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Image block */}
      <div className="relative w-48 min-w-[192px] h-48 cursor-pointer bg-gray-100" onClick={() => setShowImageModal(true)}>
        <img
          src={images[imageIndex]}
          alt="תמונה של מגרש"
          className="w-full h-full object-cover rounded-l-xl"
        />
        {images.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); setImageIndex((imageIndex - 1 + images.length) % images.length); }} className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white px-2 py-1 rounded-full">‹</button>
            <button onClick={(e) => { e.stopPropagation(); setImageIndex((imageIndex + 1) % images.length); }} className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white px-2 py-1 rounded-full">›</button>
          </>
        )}
        {Distance !== undefined && (
          <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded-full opacity-80">
            {Distance.toFixed(1)} ק״מ
          </span>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="relative bg-white p-4 rounded-lg max-w-3xl w-full">
            <img src={images[imageIndex]} alt="תמונה גדולה" className="w-full h-auto rounded-lg" />
            {images.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <button onClick={() => setImageIndex((imageIndex - 1 + images.length) % images.length)} className="text-white text-3xl">‹</button>
                <button onClick={() => setImageIndex((imageIndex + 1) % images.length)} className="text-white text-3xl">›</button>
              </div>
            )}
            <button onClick={() => setShowImageModal(false)} className="absolute top-2 right-4 text-white text-xl hover:text-red-400">✖</button>
          </div>
        </div>
      )}

      {/* Navigation Modal */}
      {showNavPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center space-y-4 w-[280px]">
            <h3 className="text-lg font-bold mb-2">בחר אפליקציית ניווט</h3>
            <div className="flex justify-around items-center gap-4">
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${Latitude},${Longitude}`} target="_blank" rel="noopener noreferrer">
                <img src="https://cdn-icons-png.flaticon.com/512/2875/2875433.png" alt="Google Maps" className="w-10 h-10 hover:scale-110 transition" />
              </a>
              <a href={`https://maps.apple.com/?daddr=${Latitude},${Longitude}`} target="_blank" rel="noopener noreferrer">
                <img src="https://developer.apple.com/assets/elements/icons/maps/maps-96x96_2x.png" alt="Apple Maps" className="w-10 h-10 hover:scale-110 transition" />
              </a>
              <a href={`https://waze.com/ul?ll=${Latitude},${Longitude}&navigate=yes`} target="_blank" rel="noopener noreferrer">
                <img src="https://cdn-icons-png.flaticon.com/512/3800/3800071.png" alt="Waze" className="w-10 h-10 hover:scale-110 transition" />
              </a>
            </div>
            <button onClick={() => setShowNavPopup(false)} className="text-sm text-gray-600 mt-3 hover:text-red-500">❌ סגור</button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
