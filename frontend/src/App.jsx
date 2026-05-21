import { Routes, Route, useLocation } from "react-router-dom";

import Navbar  from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import Prediction from "./Pages/Prediction";
import MapView from "./Pages/MapView";

// Home page pe sidebar/navbar nahi dikhana — clean hero look
const HIDE_CHROME = ["/"];

function App() {
  const { pathname } = useLocation();
  const showChrome = !HIDE_CHROME.includes(pathname);

  return (
    <div className="bg-[#07090f] text-white min-h-screen flex">

      {/* ── Sidebar — only non-home pages ── */}
      {showChrome && <Sidebar />}

      {/* ── Main wrapper ── */}
      <div className={`flex-1 flex flex-col min-h-screen ${showChrome ? "ml-60" : ""}`}>

        {/* ── Navbar — only non-home pages ── */}
        {showChrome && <Navbar />}

        {/* ── Page content — push below fixed navbar ── */}
        <main className={showChrome ? "pt-14 flex-1 overflow-y-auto" : "flex-1"}>
          <Routes>
            <Route path="/"           element={<Home />} />
            <Route path="/dashboard"  element={<Dashboard />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/map"        element={<MapView />} />
          </Routes>
        </main>

      </div>

    </div>
  );
}

export default App;