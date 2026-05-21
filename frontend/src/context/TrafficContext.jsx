import { createContext, useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";

export const TrafficContext = createContext();

const socket = io(
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"
);

const CITY_ZONES = [
  { id: 1, name: "Delhi", lat: 28.6139, lng: 77.2090 },
  { id: 2, name: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { id: 3, name: "Bangalore", lat: 12.9716, lng: 77.5946 },
  { id: 4, name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { id: 5, name: "Kolkata", lat: 22.5726, lng: 88.3639 },
];

const randomTraffic = () => Math.floor(Math.random() * 1100) + 100;

export const getTrafficColor = (value) => {
  if (value > 800)
    return {
      color: "#ef4444",
      label: "High",
      bg: "bg-red-500/20",
      text: "text-red-400",
    };

  if (value > 500)
    return {
      color: "#f59e0b",
      label: "Medium",
      bg: "bg-yellow-500/20",
      text: "text-yellow-400",
    };

  return {
    color: "#22c55e",
    label: "Low",
    bg: "bg-green-500/20",
    text: "text-green-400",
  };
};

const buildZones = () =>
  CITY_ZONES.map((z) => ({
    ...z,
    traffic: randomTraffic(),
  }));

export const TrafficProvider = ({ children }) => {
  const [latestPrediction, setLatestPredictionState] = useState(null);

  const [zones, setZones] = useState(buildZones());

  const [simulationActive, setSimulationActive] = useState(true);

  const [predictionHistory, setPredictionHistory] = useState([]);

  const [liveChartData, setLiveChartData] = useState([]);

  const [congestionLevel, setCongestionLevel] = useState("Low");

  // =========================
  // AUTO SIMULATION
  // =========================
  useEffect(() => {
    if (!simulationActive) return;

    const interval = setInterval(() => {
      setZones((prev) =>
        prev.map((zone) =>
          Math.random() > 0.5
            ? {
                ...zone,
                traffic: randomTraffic(),
              }
            : zone
        )
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [simulationActive]);

  // =========================
  // SOCKET LISTENER
  // =========================
  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to backend");
    });

    socket.on("new_prediction", (data) => {
      const value = data.prediction;

      const congestion =
        value > 800
          ? "High"
          : value > 500
          ? "Medium"
          : "Low";

      const time = new Date().toLocaleTimeString();

      setCongestionLevel(congestion);

      // Prediction History
      setPredictionHistory((prev) => {
        const updated = [
          {
            id: Date.now(),
            value,
            time,
            level: congestion,
          },
          ...prev,
        ];

        return updated.slice(0, 10);
      });

      // Live Chart
      setLiveChartData((prev) => {
        const updated = [
          ...prev,
          {
            time,
            traffic: value,
            avg: Math.round(value * 0.8),
          },
        ];

        return updated.slice(-10);
      });

      // Update Delhi zone
      setZones((prev) =>
        prev.map((z) =>
          z.id === 1
            ? {
                ...z,
                traffic: value,
              }
            : z
        )
      );
    });

    socket.on("disconnect", () => {
      console.log("❌ Backend disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("new_prediction");
      socket.off("disconnect");
    };
  }, []);

  // =========================
  // UPDATE PREDICTION
  // =========================
  const setLatestPrediction = useCallback((value) => {
    setLatestPredictionState(value);
  }, []);

  return (
    <TrafficContext.Provider
      value={{
        latestPrediction,
        setLatestPrediction,
        zones,
        simulationActive,
        setSimulationActive,
        predictionHistory,
        liveChartData,
        congestionLevel,
        getTrafficColor,
      }}
    >
      {children}
    </TrafficContext.Provider>
  );
};