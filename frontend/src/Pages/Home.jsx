import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: "🧠",
    title: "XGBoost ML Model",
    desc: "Trained on real traffic + weather dataset. Predicts vehicle volume with 94%+ accuracy.",
    accent: "#3b82f6",
  },
  {
    icon: "⚡",
    title: "Real-Time WebSocket",
    desc: "Every prediction is instantly broadcast via Flask-SocketIO to all connected clients.",
    accent: "#8b5cf6",
  },
  {
    icon: "🗺️",
    title: "Multi-City Heatmap",
    desc: "5 Indian cities tracked live — Delhi, Mumbai, Bangalore, Chennai & Kolkata.",
    accent: "#06b6d4",
  },
  {
    icon: "📊",
    title: "Smart Dashboard",
    desc: "Live area charts, congestion gauge, AI insights and prediction history table.",
    accent: "#10b981",
  },
];

const STATS = [
  { value: "94.2%", label: "Model Accuracy" },
  { value: "5",     label: "Cities Tracked" },
  { value: "<1s",   label: "Prediction Time" },
  { value: "Live",  label: "WebSocket Feed"  },
];

const TECH = [
  { name: "React + Vite",  color: "#61dafb" },
  { name: "Flask",         color: "#38bdf8" },
  { name: "XGBoost",       color: "#f59e0b" },
  { name: "Socket.IO",     color: "#a78bfa" },
  { name: "React Leaflet", color: "#22c55e" },
  { name: "Tailwind CSS",  color: "#38bdf8" },
  { name: "Recharts",      color: "#f472b6" },
];

const Home = () => {
  return (
    <div className="text-white min-h-screen bg-[#07090f] relative overflow-x-hidden">

      {/* ── Background ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute w-[700px] h-[700px] rounded-full opacity-[0.06] blur-[160px]"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent)", top: "-200px", left: "-200px" }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.05] blur-[140px]"
          style={{ background: "radial-gradient(circle, #8b5cf6, transparent)", bottom: "-100px", right: "-100px" }} />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />
      </div>

      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-10 pb-20 text-center">

        {/* ── Live badge ── */}
        <div className="mb-10 inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-blue-500/20 bg-blue-500/8 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
          </span>
          <span className="text-blue-300 text-xs font-semibold tracking-wide">
            System Online · Predictions Running Live
          </span>
        </div>

        {/* ── Heading ── */}
        <h1 className="text-5xl sm:text-7xl font-black leading-[0.92] tracking-tight mb-10 max-w-4xl">
          <span className="text-white">Smart</span>
          <br />
          <span style={{
            background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 45%, #22d3ee 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Traffic Prediction
          </span>
          <br />
          <span className="text-white/55 text-4xl sm:text-5xl font-bold">System</span>
        </h1>

        {/* ── QUOTE — replaces generic subtitle ── */}
        <div className="mb-12 max-w-xl mx-auto">
          <div className="relative px-6 py-5 rounded-2xl border border-white/6 bg-white/[0.025] backdrop-blur-sm">
            {/* big quote mark */}
            <span
              className="absolute -top-5 left-5 text-6xl font-black leading-none select-none"
              style={{ color: "#3b82f630" }}
            >
              "
            </span>
            <p className="text-white/60 text-base sm:text-lg italic leading-relaxed font-light">
              Every minute stuck in traffic is a minute the city failed to think ahead.
            </p>
            <p className="text-white/25 text-xs mt-3 font-medium tracking-wide">
              — Built to change that.
            </p>
          </div>
        </div>

        {/* ── CTA Buttons ── */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          <Link to="/prediction">
            <button
              className="group relative px-8 py-3.5 rounded-xl font-bold text-sm overflow-hidden transition-all duration-300 hover:scale-105 shadow-lg"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                boxShadow: "0 0 30px #3b82f625",
              }}
            >
              🔮 Try Prediction
            </button>
          </Link>

          <Link to="/dashboard">
            <button className="px-8 py-3.5 rounded-xl font-bold text-sm border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              📊 Live Dashboard
            </button>
          </Link>

          <Link to="/map">
            <button className="px-8 py-3.5 rounded-xl font-bold text-sm border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              🗺️ City Heatmap
            </button>
          </Link>
        </div>

        {/* ── Stats Row ── */}
        <div className="w-full max-w-2xl mx-auto mb-16">
          <div className="grid grid-cols-4 gap-4 bg-white/[0.03] border border-white/8 rounded-2xl px-6 py-5 backdrop-blur-sm">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">{s.value}</span>
                <span className="text-[11px] text-white/30 mt-1 font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Feature Cards ── */}
        <div className="w-full max-w-5xl mx-auto mb-16">
          <p className="text-[11px] text-white/20 uppercase tracking-[0.2em] font-semibold mb-6">
            Core Features
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group relative bg-white/[0.03] border border-white/8 rounded-2xl p-5 text-left overflow-hidden hover:-translate-y-1.5 hover:border-white/15 transition-all duration-300"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{ background: `radial-gradient(ellipse at top left, ${f.accent}15, transparent 70%)` }}
                />
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4 relative z-10"
                  style={{ background: `${f.accent}15`, border: `1px solid ${f.accent}30` }}
                >
                  {f.icon}
                </div>
                <p className="text-sm font-bold text-white mb-1.5 relative z-10">{f.title}</p>
                <p className="text-xs text-white/35 leading-relaxed relative z-10">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── How It Works ── */}
        <div className="w-full max-w-3xl mx-auto mb-16">
          <p className="text-[11px] text-white/20 uppercase tracking-[0.2em] font-semibold mb-6">
            How It Works
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: "01", icon: "📝", title: "Input Data",    text: "Fill weather conditions, time of day and vehicle count" },
              { step: "02", icon: "🤖", title: "ML Prediction", text: "XGBoost model processes features and returns traffic volume" },
              { step: "03", icon: "📡", title: "Live Broadcast", text: "SocketIO pushes result — dashboard & map update instantly" },
            ].map((s) => (
              <div key={s.step} className="bg-white/[0.02] border border-white/6 rounded-2xl p-5 text-center">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl mx-auto mb-3">
                  {s.icon}
                </div>
                <span className="text-[10px] text-white/20 font-black tracking-widest block mb-1">{s.step}</span>
                <p className="text-sm font-bold text-white mb-1">{s.title}</p>
                <p className="text-xs text-white/30 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tech Stack ── */}
        <div className="w-full max-w-2xl mx-auto">
          <p className="text-[11px] text-white/20 uppercase tracking-[0.2em] font-semibold mb-4">
            Built With
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {TECH.map((t) => (
              <span
                key={t.name}
                className="text-[11px] px-3.5 py-1.5 rounded-full font-semibold border transition-all duration-200 hover:scale-105 cursor-default"
                style={{
                  backgroundColor: `${t.color}10`,
                  borderColor:     `${t.color}25`,
                  color:           `${t.color}cc`,
                }}
              >
                {t.name}
              </span>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
};

export default Home;