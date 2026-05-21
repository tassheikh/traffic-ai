import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useContext } from "react";
import { TrafficContext } from "../context/TrafficContext";

const MapView = () => {
  const { zones, simulationActive, setSimulationActive, getTrafficColor } =
    useContext(TrafficContext);

  const center = [20.5937, 78.9629];

  const highCount = zones.filter((z) => z.traffic > 800).length;
  const medCount  = zones.filter((z) => z.traffic > 500 && z.traffic <= 800).length;
  const lowCount  = zones.filter((z) => z.traffic <= 500).length;

  return (
    <div className="min-h-screen w-full flex flex-col text-white p-4 gap-4 bg-[#07090f]">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">🗺️ Live Traffic Heatmap</h1>
          <p className="text-white/50 text-sm mt-1">
            Multi-zone real-time traffic across 5 major Indian cities
          </p>
        </div>
        <button
          onClick={() => setSimulationActive((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-300 ${
            simulationActive
              ? "bg-green-500/20 border-green-500/40 text-green-400"
              : "bg-white/5 border-white/10 text-white/50"
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${simulationActive ? "bg-green-400 animate-pulse" : "bg-white/30"}`} />
          {simulationActive ? "Simulation ON" : "Simulation OFF"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "High Traffic",   count: highCount, color: "text-red-400",    bg: "bg-red-500/10 border-red-500/20"    },
          { label: "Medium Traffic", count: medCount,  color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
          { label: "Low Traffic",    count: lowCount,  color: "text-green-400",  bg: "bg-green-500/10 border-green-500/20"  },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-3 flex flex-col items-center ${s.bg}`}>
            <span className={`text-2xl font-bold ${s.color}`}>{s.count}</span>
            <span className="text-xs text-white/50 mt-1">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ✅ MAP — overflow:visible, z-index fix, no pointer-events blocking */}
      <div
        className="w-full rounded-2xl border border-white/10"
        style={{ height: "450px", position: "relative", zIndex: 1 }}
      >
        <MapContainer
          center={center}
          zoom={5}
          scrollWheelZoom={true}
          dragging={true}
          touchZoom={true}
          doubleClickZoom={true}
          boxZoom={true}
          keyboard={true}
          style={{
            height: "100%",
            width: "100%",
            borderRadius: "1rem",
            zIndex: 1,
          }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {zones.map((zone) => {
            const tc = getTrafficColor(zone.traffic);
            return (
              <Circle
                key={zone.id}
                center={[zone.lat, zone.lng]}
                radius={60000}
                pathOptions={{
                  color:       tc.color,
                  fillColor:   tc.color,
                  fillOpacity: 0.45,
                  weight:      2,
                }}
              >
                <Popup>
                  <div style={{ minWidth: "140px" }}>
                    <p style={{ fontWeight: "bold", marginBottom: "4px" }}>📍 {zone.name}</p>
                    <p>🚗 Vehicles: <b>{zone.traffic}</b></p>
                    <p>🚦 Status: <b style={{ color: tc.color }}>{tc.label}</b></p>
                  </div>
                </Popup>
              </Circle>
            );
          })}
        </MapContainer>
      </div>

      {/* Zone List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {zones.map((zone) => {
          const tc = getTrafficColor(zone.traffic);
          return (
            <div key={zone.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full animate-pulse flex-shrink-0"
                  style={{ backgroundColor: tc.color }} />
                <span className="text-sm font-semibold">{zone.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40">{zone.traffic} v/h</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tc.bg} ${tc.text}`}>
                  {tc.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-5 flex-wrap pb-2">
        {[
          { color: "#22c55e", label: "Low (≤500)" },
          { color: "#f59e0b", label: "Medium (501–800)" },
          { color: "#ef4444", label: "High (>800)" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-2 text-xs text-white/60">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: l.color }} />
            {l.label}
          </div>
        ))}
      </div>

    </div>
  );
};

export default MapView;