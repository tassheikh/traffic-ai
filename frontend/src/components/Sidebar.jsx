import { NavLink } from "react-router-dom";

const NAV = [
  { to: "/",           icon: "🏠", label: "Home" },
  { to: "/dashboard",  icon: "📊", label: "Dashboard" },
  { to: "/prediction", icon: "🔮", label: "Prediction" },
  { to: "/map",        icon: "🗺️", label: "Map View" },
];

const Sidebar = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
        : "text-white/40 hover:text-white hover:bg-white/5"
    }`;

  return (
    <aside className="h-screen w-60 bg-[#07090f] border-r border-white/5 fixed left-0 top-0 flex flex-col z-40">

      {/* Brand */}
      <div className="px-6 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-base">
            🚦
          </div>
          <div>
            <p className="font-bold text-white text-sm tracking-tight">
              Traffic<span className="text-blue-400">AI</span>
            </p>
            <p className="text-[10px] text-white/30">ML Prediction System</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        <p className="text-[10px] text-white/20 font-semibold uppercase tracking-widest px-4 mb-2">
          Navigation
        </p>
        {NAV.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} className={linkClass}>
            <span className="text-base">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-5 border-t border-white/5">
        <div className="flex items-center gap-2 text-xs text-white/30">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Live System Active
        </div>
        <p className="text-[10px] text-white/20 mt-1">XGBoost · Flask · Socket.IO</p>
      </div>

    </aside>
  );
};

export default Sidebar;