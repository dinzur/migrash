from flask import Flask, request, jsonify
from flask_cors import CORS
from data_loader import load_court_data
from distance_utils import find_nearest
import pandas as pd

app = Flask(__name__)
CORS(app)

court_data = load_court_data()

def safe(val):
    return None if pd.isna(val) or val != val else val

@app.route("/")
def home():
    return "🏀 Welcome to MeGrash Sports Court API!"

@app.route("/api/closest", methods=["POST"])
def get_closest_courts():
    try:
        data = request.get_json()
        lat = data.get("lat")
        lon = data.get("lon")
        count = int(data.get("count", 5))
        selected_type = (data.get("type") or "all").strip().lower()
        surface = (data.get("surface") or "").strip().lower()
        lighting = data.get("lighting", False)

        if lat is None or lon is None:
            return jsonify({"error": "Missing coordinates"}), 400

        # Court type mapping from UI input (English) to Hebrew keyword
        TYPE_MAP = {
            "football": "כדורגל",
            "basketball": "כדורסל",
            "volleyball": "כדורעף",
            "multi": "משולב",
            "multi-purpose": "משולב"
        }

        mapped_type = TYPE_MAP.get(selected_type, None)

        filtered_df = court_data.copy()

        if mapped_type:
            filtered_df = filtered_df[
                filtered_df["CourtType"].astype(str).str.contains(mapped_type, na=False)
            ]

        if surface:
            filtered_df = filtered_df[
                filtered_df["SurfaceType"].astype(str).str.lower().str.contains(surface)
            ]

        if lighting:
            filtered_df = filtered_df[filtered_df.get("Lighting", False)]

        if filtered_df.empty:
            return jsonify([])

        # Find nearest courts (ordered)
        nearest = find_nearest(lat, lon, filtered_df, n=count)

        # Preserve distance order and group by location manually
        result = []
        seen = set()

        for _, row in nearest.iterrows():
            key = (row["Latitude"], row["Longitude"])

            if key in seen:
                continue
            seen.add(key)

            group = nearest[(nearest["Latitude"] == key[0]) & (nearest["Longitude"] == key[1])]

            courts = []
            for _, r in group.iterrows():
                courts.append({
                    "CourtType": safe(r["CourtType"]),
                    "SurfaceType": safe(r["SurfaceType"]),
                    "City": safe(r["City"]),
                    "Street": safe(r["Street"]),
                    "StreetNumber": safe(r["StreetNumber"]),
                    "Distance": safe(r["Distance"]),
                    "Lighting": bool(r.get("Lighting", False)),
                    "Address": f'{safe(r["Street"])} {safe(r["StreetNumber"])}, {safe(r["City"])}',
                    "Availability": safe(r.get("Availability")),
                    "Affiliation": safe(r.get("Affiliation")),
                    "Description": safe(r.get("Description")),
                    "Latitude": safe(r["Latitude"]),
                    "Longitude": safe(r["Longitude"]),
                })

            result.append({
                "Latitude": key[0],
                "Longitude": key[1],
                "Courts": courts
            })

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("🚀 MeGrash API starting...")
    app.run(debug=True)
