import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Predict traffic ──
export const getPrediction = async (data) => {
  try {
    const res = await API.post("/predict", data);

    // Safety check — agar success field nahi hai response mein
    if (res.data && res.data.prediction !== undefined) {
      return {
        success:    true,
        prediction: res.data.prediction,
        congestion: res.data.congestion || "Unknown",
      };
    }

    return { success: false, error: "Invalid response shape" };

  } catch (err) {
    console.error("❌ API Error:", err?.response?.data || err.message);
    return { success: false, error: err.message };
  }
};

export default API;