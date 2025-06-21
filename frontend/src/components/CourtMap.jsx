import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon paths
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

L.Marker.prototype.options.icon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function Recenter({ center }) {
  const map = useMap();
  map.setView(center);
  return null;
}

export default function CourtMap({ courts, center, onFindMe }) {
  return (
    <div className="relative h-[500px] rounded-xl overflow-hidden shadow mb-6">
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Recenter center={center} />

        <MarkerClusterGroup chunkedLoading disableClusteringAtZoom={10}>
          {courts.map((group, i) => (
            <Marker key={i} position={[group.Latitude, group.Longitude]}>
              <Popup>
                <div className="text-right text-sm space-y-2">
                  {group.Courts.map((court, j) => (
                    <div key={j} className="border-b pb-2 mb-2">
                      <div className="font-semibold">{court.CourtType}</div>
                      <div>{court.Street} {court.StreetNumber}, {court.City}</div>
                      <div>סוג משטח: {court.SurfaceType}</div>
                      <div>מרחק: {court.Distance?.toFixed(2)} ק״מ</div>
                    </div>
                  ))}
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      <button
        className="absolute bottom-4 left-4 bg-green-500 text-white px-5 py-3 rounded-full shadow-xl hover:bg-green-600 transition"
        onClick={() => alert("Feature coming soon: Add new court")}
      >
        ➕ הוסף מגרש
      </button>

      <button
        className="absolute bottom-4 right-4 bg-blue-500 text-white px-5 py-3 rounded-full shadow-xl hover:bg-blue-600 transition"
        onClick={onFindMe}
      >
        📍 מצא אותי
      </button>
    </div>
  );
}
