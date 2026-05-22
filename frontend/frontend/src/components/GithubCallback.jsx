import { useEffect, useContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

function GithubCallback() {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const { updateGithubStatus } =
    useContext(AuthContext);

  const [error, setError] = useState("");

  useEffect(() => {
    const success = searchParams.get("success");

    const err = searchParams.get("error");

    const username =
      searchParams.get("username");

    const avatar =
      searchParams.get("avatar");

    const handleGithubAuth = async () => {
      try {
        // ERROR CASE
        if (err) {
          setError(
            "Failed to authenticate with GitHub. Please try again."
          );

          setTimeout(() => {
            navigate("/");
          }, 3000);

          return;
        }

        // SUCCESS CASE
        if (success === "true" && username) {
          updateGithubStatus({
            githubUsername: username,
            githubAvatar: avatar,
          });

          // Redirect after short delay
          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error(
          "GitHub OAuth Error:",
          error
        );

        setError(
          "Something went wrong while connecting GitHub."
        );

        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    };

    handleGithubAuth();

    // IMPORTANT:
    // empty dependency array prevents infinite rerenders
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
      <div className="text-center">
        {error ? (
          <div className="text-red-400 text-lg font-medium">
            {error}
          </div>
        ) : (
          <>
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />

            <h2 className="text-2xl font-semibold">
              Completing GitHub Connection...
            </h2>

            <p className="text-gray-400 mt-2">
              Redirecting you back to dashboard.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default GithubCallback;