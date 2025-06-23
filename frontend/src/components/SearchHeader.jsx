import { useState } from "react";
import { FaSearchLocation } from "react-icons/fa";

export default function SearchHeader({
  address,
  setAddress,
  courtType,
  setCourtType,
  onSearch,
  onClear,
  onFindMe,
  count,
  setCount,
  lighting,
  setLighting,
  surface,
  setSurface,
}) {
  const [showFilters, setShowFilters] = useState(false);

  const typeOptions = [
    { label: "⚽ כדורגל", value: "football" },
    { label: "🏀 כדורסל", value: "basketball" },
    { label: "🏐 כדורעף", value: "volleyball" },
    { label: "🏟️ משולב", value: "multi-purpose" },
    { label: "🌀 הכל", value: "all" },
  ];

  const hasActiveFilters = lighting || surface;

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 max-w-4xl mx-auto mb-6 text-right">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        מצא את המגרש הציבורי הקרוב אליך!
      </h2>

      {/* 🔍 Search Row */}
      <div className="flex flex-wrap gap-3 items-center justify-center mb-4">
        <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full w-full md:w-2/3 max-w-md">
          <FaSearchLocation className="text-gray-500 ml-2" />
          <input
            type="text"
            placeholder="חפש לפי שם או כתובת..."
            className="bg-transparent flex-1 focus:outline-none text-right"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
        </div>

        <button
          onClick={onFindMe}
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
        >
          📍 מצא אותי
        </button>

        <button
          onClick={onSearch}
          className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition"
        >
          🔍 חפש
        </button>
      </div>

      {/* 🏀 Court Type Filter Buttons */}
      <div className="flex justify-center flex-wrap gap-2 mb-2">
        {typeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setCourtType(option.value)}
            className={`px-4 py-2 rounded-full font-medium border transition ${
              courtType === option.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* 🔢 Count Field */}
      <div className="flex justify-center mb-4">
        <label className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
          <span className="text-sm text-gray-800 font-medium">🔢 מספר מגרשים רצויים:</span>
          <input
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 w-16 text-center"
          />
        </label>
      </div>

      {/* 🧰 Reset & Filter Toggles */}
      <div className="flex justify-center gap-4 mb-4 flex-wrap">
        <button
          onClick={onClear}
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-400 transition"
        >
          ❌ איפוס
        </button>

        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="bg-yellow-200 text-yellow-900 px-6 py-2 rounded-full hover:bg-yellow-300 transition"
        >
          🛠️ תכונות מגרש
        </button>
      </div>

      {/* 🏷️ Active Filter Badges */}
      {!showFilters && hasActiveFilters && (
        <div className="flex justify-center gap-4 mb-2 flex-wrap">
          {lighting && (
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
              💡 תאורה פעילה
            </span>
          )}
          {surface && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              🧱 משטח: {surface}
            </span>
          )}
        </div>
      )}

      {/* 🎛️ Advanced Filters Section */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          showFilters ? "max-h-40 mt-2" : "max-h-0"
        }`}
      >
        {showFilters && (
          <div className="flex justify-center flex-wrap gap-6 mt-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={lighting}
                onChange={() => setLighting(!lighting)}
              />
              <span>💡 רק עם תאורה</span>
            </label>

            <div className="flex items-center gap-2">
              <span>🧱 סוג משטח:</span>
              <input
                type="text"
                value={surface}
                onChange={(e) => setSurface(e.target.value)}
                className="border px-2 py-1 rounded w-40"
                placeholder="למשל: דשא סינתטי"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
