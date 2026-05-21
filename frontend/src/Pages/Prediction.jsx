import { useState, useContext } from "react";
import { TrafficContext } from "../context/TrafficContext";
import { getPrediction } from "../services/api";

const WEATHER_OPTIONS = ["Clear", "Clouds", "Rain", "Snow", "Mist", "Fog"];
const WEATHER_DESC    = ["clear sky", "few clouds", "light rain", "heavy snow", "mist", "fog"];

const INPUT_FIELDS = [
  { name: "temp",       label: "Temperature (°C)", placeholder: "e.g. 28", type: "number" },
  { name: "rain_1h",    label: "Rain 1h (mm)",      placeholder: "e.g. 0",  type: "number" },
  { name: "snow_1h",    label: "Snow 1h (mm)",      placeholder: "e.g. 0",  type: "number" },
  { name: "clouds_all", label: "Cloud Cover (%)",   placeholder: "e.g. 40", type: "number" },
  { name: "hour",       label: "Hour (0–23)",        placeholder: "e.g. 8",  type: "number" },
  { name: "day",        label: "Day (1–31)",         placeholder: "e.g. 15", type: "number" },
  { name: "month",      label: "Month (1–12)",       placeholder: "e.g. 5",  type: "number" },
  { name: "weekday",    label: "Weekday (0=Mon)",    placeholder: "e.g. 2",  type: "number" },
];

const getCongestionMeta = (val) => {
  if (val > 800) return { label: "High",   color: "#ef4444", bg: "from-red-500/20 to-red-900/10",       border: "border-red-500/40",    bar: 90 };
  if (val > 500) return { label: "Medium", color: "#f59e0b", bg: "from-yellow-500/20 to-yellow-900/10", border: "border-yellow-500/40", bar: 55 };
  return               { label: "Low",    color: "#22c55e", bg: "from-green-500/20 to-green-900/10",   border: "border-green-500/40",  bar: 25 };
};

const Prediction = () => {
  const { setLatestPrediction } = useContext(TrafficContext);

  const [formData, setFormData] = useState({
    temp: "", rain_1h: "", snow_1h: "", clouds_all: "",
    weather_main: "Clear", weather_description: "clear sky",
    hour: "", day: "", month: "", weekday: "", vehicles: "",
  });

  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.temp || !formData.hour || !formData.vehicles) {
      setError("⚠️ Temperature, Hour and Vehicles are required.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await getPrediction({
        temp:                Number(formData.temp),
        rain_1h:             Number(formData.rain_1h)    || 0,
        snow_1h:             Number(formData.snow_1h)    || 0,
        clouds_all:          Number(formData.clouds_all) || 0,
        weather_main:        formData.weather_main,
        weather_description: formData.weather_description,
        hour:                Number(formData.hour),
        day:                 Number(formData.day)        || 1,
        month:               Number(formData.month)      || 1,
        weekday:             Number(formData.weekday)    || 0,
        vehicles:            Number(formData.vehicles),
      });

      if (response?.success) {
        setResult(response.prediction);
        setLatestPrediction(response.prediction);
      } else {
        setError(`❌ ${response?.error || "Invalid response from server."}`);
      }
    } catch {
      setError("❌ Backend error — make sure Flask server is running on port 5000.");
    }

    setLoading(false);
  };

  const meta = result !== null ? getCongestionMeta(result) : null;

  return (
    <div className="min-h-screen bg-[#07090f] text-white p-6 md:p-10 relative overflow-hidden">

      {/* Glows */}
      <div className="pointer-events-none fixed w-[500px] h-[500px] bg-blue-700 opacity-[0.07] blur-[130px] rounded-full top-[-150px] left-[-100px]" />
      <div className="pointer-events-none fixed w-[400px] h-[400px] bg-purple-700 opacity-[0.07] blur-[130px] rounded-full bottom-[-100px] right-[-100px]" />

      <div className="relative z-10 max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">🔮 Traffic Predictor</h1>
          <p className="text-white/40 text-sm mt-1">
            Enter weather + time features → XGBoost model predicts traffic volume
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md">
          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {INPUT_FIELDS.map((f) => (
                <div key={f.name}>
                  <label className="block text-xs text-white/40 font-medium mb-1.5">{f.label}</label>
                  <input
                    name={f.name}
                    type={f.type}
                    placeholder={f.placeholder}
                    value={formData[f.name]}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all"
                  />
                </div>
              ))}
            </div>

            {/* Weather row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-white/40 font-medium mb-1.5">Weather Main</label>
                <select
                  name="weather_main"
                  value={formData.weather_main}
                  onChange={handleChange}
                  className="w-full bg-[#0f1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                >
                  {WEATHER_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-white/40 font-medium mb-1.5">Weather Description</label>
                <select
                  name="weather_description"
                  value={formData.weather_description}
                  onChange={handleChange}
                  className="w-full bg-[#0f1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                >
                  {WEATHER_DESC.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>

            {/* Vehicles */}
            <div className="mb-6">
              <label className="block text-xs text-white/40 font-medium mb-1.5">Vehicles on Road</label>
              <input
                name="vehicles"
                type="number"
                placeholder="e.g. 450"
                value={formData.vehicles}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/20 hover:scale-[1.01]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Predicting...
                </span>
              ) : "🔮 Predict Traffic"}
            </button>

          </form>
        </div>

        {/* Result */}
        {meta && (
          <div className={`mt-6 bg-gradient-to-br ${meta.bg} border ${meta.border} rounded-2xl p-6 backdrop-blur-md`}>
            <p className="text-xs text-white/40 font-medium uppercase tracking-widest mb-2">Prediction Result</p>
            <div className="flex items-end gap-3 mb-4">
              <span className="text-5xl font-extrabold" style={{ color: meta.color }}>{result}</span>
              <span className="text-white/40 text-sm mb-2">vehicles / hour</span>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-xs text-white/30 mb-1">
                <span>Congestion Level</span>
                <span style={{ color: meta.color }} className="font-semibold">{meta.label}</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${meta.bar}%`, backgroundColor: meta.color }}
                />
              </div>
            </div>
            <p className="text-sm text-white/50 mt-4 leading-relaxed">
              {meta.label === "High"
                ? "⚠️ Heavy congestion predicted. Consider alternate routes or off-peak travel."
                : meta.label === "Medium"
                ? "🟡 Moderate traffic expected. Slight delays possible in peak zones."
                : "✅ Clear roads ahead. Smooth driving conditions predicted."}
            </p>
            <p className="text-[10px] text-white/20 mt-3">
              ✨ Powered by XGBoost · Updates map and dashboard automatically
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Prediction;