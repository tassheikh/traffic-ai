from flask import Flask, request, jsonify
import os
import joblib
import pandas as pd
import numpy as np
from flask_cors import CORS
from flask_socketio import SocketIO, emit

# =========================
# APP INIT
# =========================
app = Flask(__name__)
CORS(app, origins="*")

# =========================
# SOCKETIO INIT
# =========================
socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    async_mode="threading"
)

# =========================
# LOAD MODEL
# =========================
model = joblib.load("models/traffic_model.pkl")
print("✅ Model loaded successfully")

# =========================
# HEALTH CHECK
# =========================
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Traffic Prediction API is running 🚦",
        "status": "ok"
    })

# =========================
# PREDICT ROUTE
# =========================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(force=True)

        if not data:
            return jsonify({
                "success": False,
                "error": "No data received"
            }), 400

        # =========================
        # REQUIRED FIELDS
        # =========================
        required = [
            "temp",
            "rain_1h",
            "snow_1h",
            "clouds_all",
            "weather_main",
            "weather_description",
            "hour",
            "day",
            "month",
            "weekday",
            "vehicles"
        ]

        missing = [field for field in required if field not in data]

        if missing:
            return jsonify({
                "success": False,
                "error": f"Missing fields: {missing}"
            }), 400

        # =========================
        # BUILD DATAFRAME
        # =========================
        input_data = {
            "temp": float(data["temp"]),
            "rain_1h": float(data["rain_1h"]),
            "snow_1h": float(data["snow_1h"]),
            "clouds_all": float(data["clouds_all"]),
            "weather_main": str(data["weather_main"]),
            "weather_description": str(data["weather_description"]),
            "hour": int(data["hour"]),
            "day": int(data["day"]),
            "month": int(data["month"]),
            "weekday": int(data["weekday"]),
            "vehicles": int(data["vehicles"]),
        }

        df = pd.DataFrame([input_data])

        print("📊 Input DataFrame:")
        print(df)

        # =========================
        # PREDICTION
        # =========================
        prediction_raw = model.predict(df)

        result = int(round(float(prediction_raw[0])))

        print(f"🚦 Prediction: {result}")

        # =========================
        # CONGESTION LEVEL
        # =========================
        if result > 800:
            congestion = "High"
        elif result > 500:
            congestion = "Medium"
        else:
            congestion = "Low"

        # =========================
        # SOCKET EMIT
        # =========================
        socketio.emit(
            "new_prediction",
            {
                "prediction": result,
                "congestion": congestion
            }
        )

        # =========================
        # RESPONSE
        # =========================
        return jsonify({
            "success": True,
            "prediction": result,
            "congestion": congestion
        })

    except Exception as e:
        import traceback
        traceback.print_exc()

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# =========================
# SOCKET EVENTS
# =========================
@socketio.on("connect")
def handle_connect():
    print("🔌 Client Connected:", request.sid)

    emit(
        "connected",
        {
            "message": "Connected to TrafficAI server"
        }
    )

@socketio.on("disconnect")
def handle_disconnect():
    print("❌ Client Disconnected:", request.sid)

# =========================
# RUN SERVER
# =========================
if __name__ == "__main__":

    # Render dynamic port support
    port = int(os.environ.get("PORT", 5000))

    socketio.run(
        app,
        host="0.0.0.0",
        port=port,
        debug=False,
        allow_unsafe_werkzeug=True
    )