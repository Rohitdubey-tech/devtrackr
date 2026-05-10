import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "./authStore";
import { Loader2 } from "lucide-react";

export const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchUser } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      const accessToken = searchParams.get("accessToken");
      const refreshToken = searchParams.get("refreshToken");

      if (accessToken && refreshToken) {
        // Save tokens to localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // Fetch user profile to fully populate store
        await fetchUser();
        
        // Redirect to dashboard
        navigate("/");
      } else {
        // Handle error (no tokens)
        navigate("/login?error=OAuthFailed");
      }
    };

    handleCallback();
  }, [searchParams, navigate, fetchUser]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0D14]">
      <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
      <h2 className="text-xl font-semibold text-white">Authenticating...</h2>
      <p className="text-slate-400 mt-2">Please wait while we log you in.</p>
    </div>
  );
};
