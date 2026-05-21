import joblib
import pandas as pd

model = joblib.load("models/traffic_model.pkl")

sample = pd.DataFrame([{
    "temp": 20,
    "rain_1h": 0,
    "snow_1h": 0,
    "clouds_all": 40,
    "weather_main": "Clouds",
    "weather_description": "scattered clouds",

    # dummy date_time features (model expects extracted)
    "hour": 8,
    "day": 21,
    "month": 4,
    "weekday": 1
}])

print("🚦 Prediction:", model.predict(sample)[0])