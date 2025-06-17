from flask import Flask, request, jsonify
from flask_cors import CORS
from data_loader import load_court_data
from distance_utils import find_nearest
import numpy as np

app = Flask(__name__)
CORS(app)

# Load the data once when the app starts
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

        if lat is None or lon is None:
            return jsonify({"error": "Missing coordinates"}), 400

        filtered_df = court_data.copy()

        if selected_type != "all":
            filtered_df = filtered_df[
                filtered_df["CourtType"].astype(str).str.lower().str.contains(selected_type)
            ]

        print("Filtered:", len(filtered_df), "rows matching type:", selected_type)

        nearest = find_nearest(lat, lon, filtered_df, n=count)
        nearest = nearest.replace({np.nan: None})  # JSON-safe
        return jsonify(nearest.to_dict(orient="records"))

    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    print("🚀 MeGrash API starting...")
    app.run(debug=True)
