import pandas as pd

def load_court_data(path='COURTS.xlsx', sheet='Tel Aviv'):
    df = pd.read_excel(path, sheet_name=sheet)
    df = df.rename(columns={
        'facility_name_he': 'CourtType',
        'surface_type_he': 'SurfaceType',
        'street_he': 'Street',
        'house_number': 'StreetNumber',
        'lat_from_address': 'Latitude',
        'lon_from_address': 'Longitude',
        'has_lights_he': 'Lighting',
        'availability_he': 'Availability',
        'school_name_he': 'Affiliation',
        'facility_description_he': 'Description',
        'city_he': 'City'
    })

    # Drop rows missing coordinates
    df = df.dropna(subset=["Latitude", "Longitude"])

    # Force Lighting to bool
    df["Lighting"] = df["Lighting"].astype(str).str.strip().eq("כן")

    # Add sports_supported array
    def map_sports(court_type):
        if "משולב" in court_type:
            return ["football", "basketball"]
        elif "כדורגל" in court_type:
            return ["football"]
        elif "כדורסל" in court_type:
            return ["basketball"]
        elif "כדורעף" in court_type:
            return ["volleyball"]
        return []

    df["sports_supported"] = df["CourtType"].astype(str).apply(map_sports)

    return df[[
        "City", "CourtType", "SurfaceType", "Street", "StreetNumber",
        "Latitude", "Longitude", "Lighting", "Availability",
        "Affiliation", "Description", "sports_supported"
    ]].reset_index(drop=True)
