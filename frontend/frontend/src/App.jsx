import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Dashboard from "./components/Dashboard";
import Repositories from "./components/Repositories";
import Reviews from "./components/Reviews";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Auth from "./components/Auth";
import GithubCallback from "./components/GithubCallback";
import { Loader2 } from "lucide-react";
import ReviewDetails from "./components/ReviewDetails";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Auth /> : <Navigate to="/" />} />
      <Route path="/github/callback" element={<GithubCallback />} />

      {/* Full-page protected route for reviews (no sidebar) */}
      <Route
        path="/reviews/:repoId"
        element={
          <ProtectedRoute>
            <ReviewDetails />
          </ProtectedRoute>
        }
      />

      {/* Protected Layout with Sidebar */}
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <div className="flex h-screen w-screen bg-[#0a0a0a] text-gray-200 overflow-hidden font-sans">
              <Sidebar />

              <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Subtle Background Glows */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />

                <Navbar />

                <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 z-10 relative">
                  <div className="max-w-7xl mx-auto">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/repositories" element={<Repositories />} />
                      <Route path="/reviews" element={<Reviews />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </div>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
