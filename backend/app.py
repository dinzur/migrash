from flask import Flask, request, jsonify
from flask_cors import CORS
from data_loader import load_court_data
from distance_utils import find_nearest
import numpy as np

app = Flask(__name__)
CORS(app)

court_data = load_court_data()

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
        selected_type = data.get("type", "all").strip().lower()
        surface = data.get("surface", "").strip().lower()
        lighting = data.get("lighting", False)

        if lat is None or lon is None:
            return jsonify({"error": "Missing coordinates"}), 400

        filtered_df = court_data.copy()

        if selected_type != "all":
            filtered_df = filtered_df[
                filtered_df["CourtType"].astype(str).str.lower().str.contains(selected_type)
            ]
        if surface:
            filtered_df = filtered_df[
                filtered_df["SurfaceType"].astype(str).str.lower().str.contains(surface)
            ]
        if lighting:
            filtered_df = filtered_df[filtered_df.get("Lighting", False)]

        nearest = find_nearest(lat, lon, filtered_df, n=count)

        grouped = nearest.groupby(["Latitude", "Longitude"])
        result = []

        for (lat_val, lon_val), group in grouped:
            courts = []
            for _, row in group.iterrows():
                courts.append({
                    "CourtType": row["CourtType"],
                    "SurfaceType": row["SurfaceType"],
                    "City": row["City"],
                    "Street": row["Street"],
                    "StreetNumber": row["StreetNumber"],
                    "Distance": row["Distance"],
                    "Lighting": row.get("Lighting", False),
                    "Address": f'{row["Street"]} {row["StreetNumber"]}, {row["City"]}'
                })

            result.append({
                "Latitude": lat_val,
                "Longitude": lon_val,
                "Courts": courts
            })

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("🚀 MeGrash API starting...")
    app.run(debug=True)
