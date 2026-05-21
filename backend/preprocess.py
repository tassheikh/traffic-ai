from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder

def get_preprocessor():
    categorical_features = ["weather_main", "weather_description"]

    numerical_features = [
        "temp","rain_1h","snow_1h","clouds_all",
        "hour","day","month","weekday",
        "rush_hour","is_holiday","weather_intensity"
    ]

    preprocessor = ColumnTransformer([
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),
        ("num", "passthrough", numerical_features)
    ])

    return preprocessor, categorical_features, numerical_features