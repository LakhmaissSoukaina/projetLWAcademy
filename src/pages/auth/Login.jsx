// frontend/src/pages/auth/Login.jsx
import { useState, useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { login, loginWithGoogle } from "../../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(email, password);
      loginUser(data.token);
      navigate("/redirect");
    } catch (err) {
      setError(err.response?.data?.message || "Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleLoading(true);
    try {
      const data = await loginWithGoogle(credentialResponse.credential);
      loginUser(data.token);
      navigate("/redirect");
    } catch (err) {
      setError("Erreur lors de l'authentification Google");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("L'authentification Google a échoué");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9ff] p-6 font-[Manrope]">
      <div
        className="w-full max-w-[1200px] bg-white rounded-xl overflow-hidden flex flex-col md:flex-row min-h-[800px] border border-gray-100"
        style={{ boxShadow: "0 4px 20px rgba(30,64,175,0.05)" }}
      >
        {/* ── LEFT: Brand ── */}
        <div className="hidden md:flex md:w-1/2 bg-[#00288e] relative overflow-hidden flex-col justify-between p-12 text-white">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-[#00288e] via-[#00288e]/40 to-transparent z-10" />
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
              alt="Academic"
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <span className="material-symbols-outlined text-4xl">school</span>
              <h1 className="text-2xl font-bold tracking-tight font-['Noto_Serif']">LW Academy</h1>
            </div>
            <div className="space-y-6">
              <h2 className="text-5xl font-bold leading-tight font-['Noto_Serif']">
                Elevating Global<br />Academic Standards.
              </h2>
              <p className="text-lg text-blue-200 opacity-90 max-w-md">
                Join a prestigious community of scholars and professors.
              </p>
            </div>
          </div>
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {["bg-blue-200", "bg-blue-300", "bg-blue-100"].map((c, i) => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 border-[#00288e] ${c}`} />
                ))}
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-300">
                10k+ Active Scholars
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Form ── */}
        <div className="w-full md:w-1/2 p-12 md:p-20 flex flex-col">

          {/* Top actions */}
          <div className="flex justify-between items-center mb-20">
            <div className="flex items-center gap-2">
              <button className="text-sm font-bold text-[#00288e] border-b-2 border-[#00288e] pb-0.5">FR</button>
              <span className="text-gray-300 text-sm">/</span>
              <button className="text-sm font-medium text-gray-400 hover:text-[#00288e] transition-colors pb-0.5">AR</button>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-xs text-gray-400">Student?</span>
              <Link to="/register" className="text-sm font-bold text-[#00288e] hover:underline">Apply Now</Link>
            </div>
          </div>

          {/* Heading */}
          <div className="flex-grow flex flex-col justify-center">
            <div className="mb-8">
              <h3 className="text-4xl font-semibold text-[#00288e] mb-1 font-['Noto_Serif']">Welcome back</h3>
              <p className="text-gray-500">Access your academic dashboard.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-gray-100 mb-8">
              <button className="text-sm font-bold pb-3 border-b-2 border-[#00288e] text-[#00288e] -mb-px">Login</button>
              <Link to="/register" className="text-sm font-semibold pb-3 text-gray-400 hover:text-gray-600 transition-colors">Sign Up</Link>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-3 mb-6 text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Institutional Email</label>
                <input
                  type="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@lw-academy.com"
                  className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:ring-0 focus:border-[#00288e] bg-transparent transition-all text-sm placeholder:text-gray-300 outline-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Password</label>
                  <a href="#" className="text-xs text-[#00288e] hover:underline">Forgot password?</a>
                </div>
                <input
                  type="password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:ring-0 focus:border-[#00288e] bg-transparent transition-all text-sm outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded text-[#00288e] focus:ring-[#00288e] border-gray-300"
                />
                <label htmlFor="remember" className="text-xs text-gray-500">Keep me signed in for 30 days</label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00288e] text-white py-4 rounded-lg text-sm font-bold hover:bg-[#1e40af] transition-all shadow-lg shadow-blue-900/10 disabled:opacity-50 mt-2"
              >
                {loading ? "Connexion..." : "Sign In to Academy"}
              </button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-xs text-gray-400">Or continue with</span>
                </div>
              </div>

              {/* Google Login Button - Style personnalisé */}
              <div className="relative">
                {googleLoading ? (
                  <div className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-[#00288e] rounded-full animate-spin"></div>
                    <span className="text-sm font-semibold text-gray-600">Connexion en cours...</span>
                  </div>
                ) : (
                  <GoogleLogin
  onSuccess={handleGoogleSuccess}
  onError={handleGoogleError}
  theme="outline"
  size="large"
  text="continue_with"
  shape="pill"
  logo_alignment="center"
  width="100%"
  containerProps={{ style: { width: '100%' } }}
/>
                )}
              </div>
            </form>

            {/* Professor CTA */}
            <div className="mt-10 p-4 bg-[#f1f3ff] rounded-xl flex items-center gap-4">
              <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="material-symbols-outlined text-[#00288e]">clinical_notes</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-800">Applying as a Professor?</p>
                <p className="text-xs text-gray-500">Validation of credentials required.</p>
              </div>
              <Link to="/register" className="text-[#00288e] font-bold text-sm underline whitespace-nowrap">Register</Link>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-6 border-t border-gray-100 flex justify-between text-xs text-gray-400">
            <p>© 2026 LW Academy. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#00288e]">Privacy</a>
              <a href="#" className="hover:text-[#00288e]">Terms</a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Login;