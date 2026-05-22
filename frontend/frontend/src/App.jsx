import { Routes, Route } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Repositories from "./components/Repositories";
import Reviews from "./components/Reviews";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="app">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/repositories" element={<Repositories />} />
            <Route path="/reviews" element={<Reviews />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
