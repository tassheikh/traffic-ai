import { NavLink } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
        : "text-white/50 hover:text-white hover:bg-white/5"
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#07090f]/80 backdrop-blur-xl">
      <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-lg">🚦</span>
          <span className="font-bold text-white tracking-tight">Traffic<span className="text-blue-400">AI</span></span>
          <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-semibold hidden sm:block">
            LIVE
          </span>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/"          className={linkClass}>Home</NavLink>
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/prediction" className={linkClass}>Prediction</NavLink>
          <NavLink to="/map"       className={linkClass}>Map View</NavLink>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white/60 hover:text-white"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#07090f]/95 backdrop-blur-xl px-6 py-4 flex flex-col gap-2">
          {["/", "/dashboard", "/prediction", "/map"].map((path, i) => (
            <NavLink
              key={path}
              to={path}
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              {["Home", "Dashboard", "Prediction", "Map View"][i]}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;