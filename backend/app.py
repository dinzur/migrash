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
        exclude_mixed = data.get("exclude_mixed_locations", False)

        if lat is None or lon is None:
            return jsonify({"error": "Missing coordinates"}), 400

        filtered_df = court_data.copy()

        if selected_type != "all":
            filtered_df = filtered_df[
                filtered_df["sports_supported"].apply(lambda lst: selected_type in lst)
            ]

        if surface:
            filtered_df = filtered_df[
                filtered_df["SurfaceType"].astype(str).str.lower().str.contains(surface)
            ]

        if lighting:
            filtered_df = filtered_df[filtered_df.get("Lighting", False)]

        if filtered_df.empty:
            return jsonify([])

        # Calculate distances first (don't limit yet)
        all_nearby = find_nearest(lat, lon, filtered_df, n=len(filtered_df))

        result = []
        seen = set()

        for _, row in all_nearby.iterrows():
            key = (row["Latitude"], row["Longitude"])
            if key in seen:
                continue
            seen.add(key)

            group = all_nearby[
                (all_nearby["Latitude"] == key[0]) & (all_nearby["Longitude"] == key[1])
            ]

            # ✅ Exclude mixed-location groups if filter is on
            if exclude_mixed:
                all_sports = group["sports_supported"].dropna().tolist()
                flattened = set(s for sublist in all_sports for s in sublist)
                if len(flattened) > 1:
                    continue

            courts = []

            for _, r in group.iterrows():
                supported = r.get("sports_supported", [])
                base_data = {
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
                }

                for sport in supported:
                    court_type = {
                        "football": "מגרש כדורגל",
                        "basketball": "מגרש כדורסל",
                        "volleyball": "מגרש כדורעף"
                    }.get(sport, "מגרש")

                    courts.append({
                        "CourtType": court_type,
                        "sports_supported": [sport],
                        **base_data
                    })

            result.append({
                "Latitude": key[0],
                "Longitude": key[1],
                "Courts": courts
            })

            # ✅ Stop once enough courts collected
            if sum(len(group["Courts"]) for group in result) >= count:
                break

        # Trim to exactly `count` results
        flattened = []
        for group in result:
            for court in group["Courts"]:
                flattened.append({
                    "Latitude": group["Latitude"],
                    "Longitude": group["Longitude"],
                    "Court": court
                })
        trimmed = flattened[:count]

        # Group again by location
        grouped = {}
        for item in trimmed:
            key = (item["Latitude"], item["Longitude"])
            if key not in grouped:
                grouped[key] = {
                    "Latitude": item["Latitude"],
                    "Longitude": item["Longitude"],
                    "Courts": []
                }
            grouped[key]["Courts"].append(item["Court"])

        return jsonify(list(grouped.values()))

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("🚀 MeGrash API starting...")
    app.run(debug=True)
