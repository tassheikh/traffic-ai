import { useContext } from "react";
import { TrafficContext } from "../context/TrafficContext";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

const initialChartData = [
  { time: "6AM",  traffic: 320, avg: 260 },
  { time: "9AM",  traffic: 850, avg: 600 },
  { time: "12PM", traffic: 540, avg: 500 },
  { time: "3PM",  traffic: 720, avg: 580 },
  { time: "6PM",  traffic: 980, avg: 700 },
  { time: "9PM",  traffic: 410, avg: 420 },
];

const getCongestionMeta = (level) => {
  if (level === "High")   return { color: "#ef4444", bg: "from-red-500/20 to-red-900/10",       border: "border-red-500/30",    bar: "bg-red-500",    pct: 90 };
  if (level === "Medium") return { color: "#f59e0b", bg: "from-yellow-500/20 to-yellow-900/10", border: "border-yellow-500/30", bar: "bg-yellow-400", pct: 55 };
  return                         { color: "#22c55e", bg: "from-green-500/20 to-green-900/10",   border: "border-green-500/30",  bar: "bg-green-400",  pct: 25 };
};

const getInsight = (level) => {
  if (level === "High")   return "⚠️ Heavy congestion detected. Expect delays of 20–35 min across major corridors.";
  if (level === "Medium") return "🟡 Moderate traffic. Minor slowdowns expected during the next hour.";
  return "✅ Roads are clear. Ideal conditions for travel right now.";
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0f1117] border border-white/10 rounded-xl px-4 py-3 text-sm shadow-xl">
      <p className="text-white/50 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const {
    predictionHistory,
    liveChartData,
    congestionLevel,
  } = useContext(TrafficContext);

  const cm          = getCongestionMeta(congestionLevel);
  const chartData   = liveChartData.length > 0 ? liveChartData : initialChartData;
  const latestValue = predictionHistory[0]?.value ?? "—";

  const statCards = [
    { label: "Latest Prediction", value: latestValue,      unit: "v/h", icon: "🚗", color: "from-blue-500/20 to-blue-900/10",   border: "border-blue-500/30"   },
    { label: "Congestion Level",  value: congestionLevel,  unit: "",    icon: "🚦", color: `${cm.bg}`,                          border: cm.border              },
    { label: "Total Predictions", value: predictionHistory.length, unit: "runs", icon: "📊", color: "from-teal-500/20 to-teal-900/10", border: "border-teal-500/30" },
    { label: "Model Accuracy",    value: "94.2%",           unit: "",    icon: "🎯", color: "from-purple-500/20 to-purple-900/10", border: "border-purple-500/30" },
  ];

  return (
    <div className="min-h-screen bg-[#07090f] text-white p-6 md:p-8 relative overflow-hidden">

      {/* Glows */}
      <div className="pointer-events-none fixed w-[500px] h-[500px] bg-blue-700 opacity-10 blur-[120px] rounded-full top-[-150px] left-[-100px]" />
      <div className="pointer-events-none fixed w-[400px] h-[400px] bg-purple-700 opacity-10 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

      {/* Header */}
      <div className="mb-8 relative z-10">
        <h1 className="text-3xl font-extrabold tracking-tight">📊 Traffic Command Center</h1>
        <p className="text-white/40 text-sm mt-1">Real-time ML predictions · WebSocket live feed</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 relative z-10">
        {statCards.map((c) => (
          <div key={c.label}
            className={`bg-gradient-to-br ${c.color} border ${c.border} rounded-2xl p-5 backdrop-blur-md`}>
            <span className="text-xl mb-3 block">{c.icon}</span>
            <p className="text-white/50 text-xs mb-1">{c.label}</p>
            <p className="text-2xl font-bold">
              {c.value}
              {c.unit && <span className="text-sm font-normal text-white/40 ml-1">{c.unit}</span>}
            </p>
          </div>
        ))}
      </div>

      {/* Chart + Right Panel */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6 relative z-10">

        {/* Area Chart */}
        <div className="lg:col-span-2 bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white/80">🚦 Live Traffic Flow</h2>
            <span className="text-xs text-white/30 bg-white/5 px-3 py-1 rounded-full">
              Last 10 predictions
            </span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="tGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#60a5fa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#a78bfa" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="time" stroke="#ffffff30" tick={{ fontSize: 11 }} />
              <YAxis stroke="#ffffff30" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="traffic" name="Traffic" stroke="#60a5fa"
                strokeWidth={2.5} fill="url(#tGrad)" dot={false} activeDot={{ r: 6 }} />
              <Area type="monotone" dataKey="avg" name="Avg" stroke="#a78bfa"
                strokeWidth={2} strokeDasharray="5 4" fill="url(#aGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Right: Gauge + Insight */}
        <div className="flex flex-col gap-4">

          <div className={`bg-gradient-to-br ${cm.bg} border ${cm.border} rounded-2xl p-5 backdrop-blur-md`}>
            <p className="text-white/50 text-xs mb-1">Congestion Level</p>
            <p className="text-2xl font-bold mb-4" style={{ color: cm.color }}>{congestionLevel}</p>
            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${cm.bar} transition-all duration-700`}
                style={{ width: `${cm.pct}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-white/30 mt-1">
              <span>Low</span><span>Medium</span><span>High</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-900/5 border border-indigo-500/20 rounded-2xl p-5 backdrop-blur-md flex-1">
            <p className="text-xs text-indigo-400 font-semibold mb-2">✨ AI Insight</p>
            <p className="text-sm text-white/70 leading-relaxed">{getInsight(congestionLevel)}</p>
            <p className="text-[10px] text-white/25 mt-3">Based on XGBoost model · 94.2% accuracy</p>
          </div>

        </div>
      </div>

      {/* Recent Predictions Table */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-md relative z-10">
        <h2 className="font-semibold text-white/80 mb-4">📋 Recent Predictions</h2>

        {predictionHistory.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-4xl mb-3">🔮</p>
            <p className="text-white/30 text-sm">Go to <b className="text-white/50">Prediction</b> page, fill the form and submit.</p>
            <p className="text-white/20 text-xs mt-1">Results will appear here live via WebSocket.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/30 text-xs border-b border-white/5">
                  <th className="text-left pb-3 font-medium">#</th>
                  <th className="text-left pb-3 font-medium">Time</th>
                  <th className="text-left pb-3 font-medium">Traffic (v/h)</th>
                  <th className="text-left pb-3 font-medium">Level</th>
                </tr>
              </thead>
              <tbody>
                {predictionHistory.map((h, i) => {
                  const levelColor =
                    h.level === "High" ? "#ef4444" :
                    h.level === "Medium" ? "#f59e0b" : "#22c55e";
                  return (
                    <tr key={h.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 text-white/30">{i + 1}</td>
                      <td className="py-3 text-white/60 font-mono text-xs">{h.time}</td>
                      <td className="py-3 font-bold text-white">{h.value}</td>
                      <td className="py-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: `${levelColor}20`, color: levelColor }}>
                          {h.level}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;