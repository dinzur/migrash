import { useState, useEffect } from "react";
import Header from "./components/Header";
import SearchHeader from "./components/SearchHeader";
import CourtMap from "./components/CourtMap";
import CourtCard from "./components/CourtCard";

export default function App() {
  const [address, setAddress] = useState("");
  const [courtType, setCourtType] = useState("all");
  const [surface, setSurface] = useState("");
  const [lighting, setLighting] = useState(false);
  const [count, setCount] = useState(5);
  const [courts, setCourts] = useState([]);
  const [center, setCenter] = useState([32.079249, 34.774114]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [warning, setWarning] = useState("");
  const [triggerSearchOnTypeChange, setTriggerSearchOnTypeChange] = useState(false);

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

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setWarning("המכשיר שלך לא תומך בזיהוי מיקום");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCenter([latitude, longitude]);
        try {
          const addressName = await reverseGeocode(latitude, longitude);
          setAddress(addressName);
        } catch (e) {
          setWarning("לא ניתן לתרגם מיקום לכתובת");
        }
      },
      () => setWarning("נכשל בזיהוי מיקום"),
      { enableHighAccuracy: true }
    );
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);
    setWarning("");
    try {
      const coords = await geocode(address);
      setCenter(coords);

      const res = await fetch("http://127.0.0.1:5000/api/closest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: coords[0],
          lon: coords[1],
          count,
          type: courtType,
          surface,
          lighting,
        }),
      });

      const result = await res.json();

      if (!Array.isArray(result)) {
        setWarning("שגיאת שרת: " + (result.error || "Invalid data"));
        setIsLoading(false);
        return;
      }

      if (result.length === 0) {
        setWarning("😞 לא נמצאו מגרשים מתאימים לכתובת והסינון שנבחרו");
      }

      const enriched = await Promise.all(
        result.map(async (group) => {
          const address = await reverseGeocode(group.Latitude, group.Longitude);
          return {
            ...group,
            Courts: group.Courts.map((court) => ({ ...court, Address: address })),
          };
        })
      );

      setCourts(enriched);
    } catch (err) {
      setWarning("שגיאה: " + err.message);
      setCourts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setAddress("");
    setCourtType("all");
    setSurface("");
    setLighting(false);
    setCount(5);
    setCourts([]);
    setCenter([32.079249, 34.774114]);
    setWarning("");
    setHasSearched(false);
  };

  useEffect(() => {
    if (triggerSearchOnTypeChange) {
      handleSearch();
      setTriggerSearchOnTypeChange(false);
    }
  }, [courtType]);

  return (
    <>
      <div className="bg-gray-50 min-h-screen font-sans">
        <Header />
        <SearchHeader
          address={address}
          setAddress={setAddress}
          courtType={courtType}
          setCourtType={(type) => {
            setCourtType(type);
            setTriggerSearchOnTypeChange(true);
          }}
          onSearch={handleSearch}
          onClear={handleClear}
          onFindMe={handleLocateMe}
          count={count}
          setCount={setCount}
          lighting={lighting}
          setLighting={setLighting}
          surface={surface}
          setSurface={setSurface}
        />

        {warning && (
          <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded shadow flex justify-between items-center max-w-4xl mx-auto">
            <span className="text-sm">{warning}</span>
            <button
              onClick={() => setWarning("")}
              className="text-yellow-900 hover:text-red-600 font-bold text-lg px-2"
            >
              ✖
            </button>
          </div>
        )}
        {isLoading && (
          <div className="text-center text-lg text-gray-600 py-4 animate-pulse">
            ⏳ טוען תוצאות...
          </div>
        )}

        <CourtMap courts={courts} center={center} onFindMe={handleLocateMe} />

        <div className="mt-6 max-w-6xl mx-auto">
          {courts.length === 0 && hasSearched ? (
            <div className="text-center text-red-600 py-8 text-lg">
              😞 לא נמצאו מגרשים מתאימים
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courts.map((group, i) =>
                group.Courts.map((court, j) => (
                  <CourtCard key={`${i}-${j}`} court={court} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
