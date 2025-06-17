import { useState } from "react";
import CourtMap from "./components/CourtMap";

export default function App() {
  const [address, setAddress] = useState("");
  const [courtType, setCourtType] = useState("all");
  const [count, setCount] = useState(5);
  const [courts, setCourts] = useState([]);
  const [center, setCenter] = useState([32.079249, 34.774114]); // Default: Dizengoff, Tel Aviv

  const geocode = async (addr) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    throw new Error("Address not found");
  };

  const reverseGeocode = async (lat, lon) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.display_name || "";
  };

  const handleSearch = async () => {
    try {
      const coords = await geocode(address);
      setCenter(coords);

      const res = await fetch("http://127.0.0.1:5000/api/closest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: coords[0],
          lon: coords[1],
          count: count,
          type: courtType
        }),
      });

      const result = await res.json();
      console.log("API result:", result);

      if (!Array.isArray(result)) {
        alert("Server error: " + (result.error || "Unknown issue"));
        return;
      }

      const enrichedCourts = await Promise.all(
        result.map(async (court) => {
          const fullAddress = await reverseGeocode(court.Latitude, court.Longitude);
          return { ...court, Address: fullAddress };
        })
      );

      setCourts(enrichedCourts);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">🏀 MeGrash: Court Finder</h1>

      <div className="flex flex-wrap gap-2 items-center justify-center">
        <input
          type="text"
          className="border p-2 rounded flex-grow min-w-[250px]"
          placeholder="Enter address (e.g., נהלל 2 תל אביב)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={courtType}
          onChange={(e) => setCourtType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="basketball">Basketball</option>
          <option value="football">Football</option>
          <option value="volleyball">Volleyball</option>
          <option value="multi-purpose">Multi purposes</option>
        </select>

        <input
          type="number"
          className="border p-2 rounded w-24"
          min={1}
          max={20}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <CourtMap courts={courts} center={center} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {courts.map((court, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl shadow p-4 space-y-2">
            <h2 className="text-xl font-semibold text-blue-700">{court.CourtType}</h2>
            <p className="text-gray-700">{court.SurfaceType}</p>
            <p className="text-sm text-gray-600">
              🏘 {court.Neighborhood} <br />
              📍 {court.Street} {court.StreetNumber}
            </p>
            {court.Address && (
              <p className="text-xs text-gray-500 italic">({court.Address})</p>
            )}
            <p className="text-sm text-green-600">
              Distance: {court.Distance.toFixed(2)} km
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
