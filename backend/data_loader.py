import pandas as pd

def load_court_data(path='COURTS.xlsx', sheet='Tel Aviv'):
    df = pd.read_excel(path, sheet_name=sheet)
    df = df.rename(columns={
        df.columns[2]: 'City',
        df.columns[3]: 'CourtType',
        df.columns[4]: 'SurfaceType',
        df.columns[5]: 'Street',
        df.columns[6]: 'StreetNumber',
        df.columns[7]: 'Latitude',
        df.columns[8]: 'Longitude'
    })
    df = df[['City', 'CourtType', 'SurfaceType', 'Street', 'StreetNumber', 'Latitude', 'Longitude']]
    df = df.dropna(subset=['Latitude', 'Longitude'])
    return df.reset_index(drop=True)
