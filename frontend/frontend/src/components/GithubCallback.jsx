import { useEffect, useContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

function GithubCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateGithubStatus } = useContext(AuthContext);
  const [error, setError] = useState("");

  useEffect(() => {
    const code = searchParams.get("code");
    
    if (code) {
      api.post("/github/callback", { code })
        .then((res) => {
          if (res.data.success) {
            updateGithubStatus(res.data.data);
            navigate("/");
          }
        })
        .catch((err) => {
          console.error("GitHub Auth Error:", err);
          setError("Failed to authenticate with GitHub. Please try again.");
          setTimeout(() => navigate("/"), 3000);
        });
    } else {
      navigate("/");
    }
  }, [searchParams, navigate, updateGithubStatus]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
      <div className="text-center">
        {error ? (
          <div className="text-red-400">{error}</div>
        ) : (
          <>
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Connecting to GitHub...</h2>
            <p className="text-gray-400 mt-2">Please wait while we verify your account.</p>
          </>
        )}
      </div>
    </div>
  );
}

export default GithubCallback;
