import { FaSearchLocation } from "react-icons/fa";

export default function SearchBar({
  address,
  setAddress,
  courtType,
  setCourtType,
  surface,
  setSurface,
  lighting,
  setLighting,
  count,
  setCount,
  onSearch,
  onClear,
  onFindMe,
}) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-6 max-w-6xl mx-auto space-y-4">
      <h2 className="text-xl font-bold text-center text-gray-800">
        מצא את המגרש הציבורי הקרוב אליך!
      </h2>

      <div className="flex flex-wrap gap-4 justify-center items-center">
        <div className="flex items-center bg-gray-100 rounded px-2 py-1 w-64">
          <FaSearchLocation className="ml-2 text-gray-500" />
          <input
            type="text"
            placeholder="חפש לפי שם או כתובת..."
            className="bg-transparent flex-1 focus:outline-none text-right"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <button
          onClick={onFindMe}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          📍 מצא אותי
        </button>

        <select
          className="border border-gray-300 p-2 rounded w-40"
          value={courtType}
          onChange={(e) => setCourtType(e.target.value)}
        >
          <option value="all">כל הסוגים</option>
          <option value="football">כדורגל</option>
          <option value="basketball">כדורסל</option>
          <option value="volleyball">כדורעף</option>
          <option value="multi-purpose">משולב</option>
        </select>

        <input
          type="text"
          className="border border-gray-300 p-2 rounded w-32 text-right"
          placeholder="סוג משטח"
          value={surface}
          onChange={(e) => setSurface(e.target.value)}
        />

        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={lighting}
            onChange={() => setLighting(!lighting)}
          />
          <span>תאורה</span>
        </label>

        <input
          type="number"
          min={1}
          max={20}
          className="border border-gray-300 p-2 rounded w-24 text-center"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        />
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={onSearch}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
        >
          🔍 חפש
        </button>

        <button
          onClick={onClear}
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 transition-colors"
        >
          ✖ נקה
        </button>
      </div>
    </div>
  );
}
