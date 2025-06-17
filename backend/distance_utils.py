import pandas as pd
from geopy.distance import geodesic

def find_nearest(lat, lon, courts_df, n=5):
    filtered_df = courts_df.dropna(subset=['Latitude', 'Longitude']).copy()

    if filtered_df.empty:
        print(">>> No courts found after filtering!")
        return pd.DataFrame()  # Return empty DataFrame gracefully

    print(">>> COLUMNS:", filtered_df.columns.tolist())
    print(">>> SAMPLE ROW:", filtered_df.iloc[0].to_dict())

    filtered_df['Distance'] = filtered_df.apply(
        lambda row: geodesic((lat, lon), (row['Latitude'], row['Longitude'])).km,
        axis=1
    )

    return filtered_df.sort_values(by='Distance').head(n)
