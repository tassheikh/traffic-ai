import pandas as pd
import joblib
import os

from xgboost import XGBRegressor
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics import mean_absolute_error

# =========================
# 1. LOAD DATA
# =========================
df = pd.read_csv("data/traffic_data.csv")

# =========================
# 2. FIX DATE FORMAT (IMPORTANT)
# =========================
df["date_time"] = pd.to_datetime(df["date_time"], dayfirst=True)

# =========================
# 3. FEATURE ENGINEERING
# =========================
df["hour"] = df["date_time"].dt.hour
df["day"] = df["date_time"].dt.day
df["month"] = df["date_time"].dt.month
df["weekday"] = df["date_time"].dt.weekday

# =========================
# 4. TARGET
# =========================
target = "traffic_volume"

X = df.drop(columns=[target, "date_time"])
y = df[target]

# =========================
# 5. FEATURES
# =========================
cat_features = ["weather_main", "weather_description"]

num_features = [
    "temp",
    "rain_1h",
    "snow_1h",
    "clouds_all",
    "hour",
    "day",
    "month",
    "weekday"
]

X = X[cat_features + num_features]

# =========================
# 6. FIX OBJECT ISSUE
# =========================
X[cat_features] = X[cat_features].astype(str)

# =========================
# 7. PREPROCESSOR
# =========================
preprocessor = ColumnTransformer([
    ("cat", OneHotEncoder(handle_unknown="ignore"), cat_features),
    ("num", "passthrough", num_features)
])

# =========================
# 8. MODEL
# =========================
model = XGBRegressor(
    n_estimators=300,
    learning_rate=0.05,
    max_depth=6,
    random_state=42
)

pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("model", model)
])

# =========================
# 9. TRAIN TEST SPLIT
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42
)

# =========================
# 10. TRAIN
# =========================
pipeline.fit(X_train, y_train)

# =========================
# 11. EVALUATION
# =========================
pred = pipeline.predict(X_test)
print("MAE:", mean_absolute_error(y_test, pred))

# =========================
# 12. SAVE MODEL
# =========================
os.makedirs("models", exist_ok=True)
joblib.dump(pipeline, "models/traffic_model.pkl")

print("✅ Model trained and saved successfully!")