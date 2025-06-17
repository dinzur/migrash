import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icons (required by Leaflet)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function CourtMap({ courts, center }) {
  // Group courts by exact [lat, lon]
  const locationMap = new Map();

  courts.forEach((court) => {
    const key = `${court.Latitude},${court.Longitude}`;
    if (!locationMap.has(key)) locationMap.set(key, []);
    locationMap.get(key).push(court);
  });

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {[...locationMap.entries()].map(([key, courtsAtLoc], i) => {
        const [lat, lon] = key.split(",").map(Number);
        return (
          <Marker key={i} position={[lat, lon]}>
            <Popup>
              <div>
                <strong>{courtsAtLoc.length} court{courtsAtLoc.length > 1 ? "s" : ""} at this location:</strong>
                <ul className="mt-2 text-sm">
                  {courtsAtLoc.map((court, idx) => (
                    <li key={idx} className="mb-1">
                      🏷 {court.CourtType} | {court.SurfaceType}
                      <br />
                      📍 {court.Street} {court.StreetNumber}, {court.Neighborhood}
                    </li>
                  ))}
                </ul>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
