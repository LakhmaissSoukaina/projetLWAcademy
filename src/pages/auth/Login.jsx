import { useState, useContext } from "react";
import { login } from "../../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);

      loginUser(data.token);

      // ✅ CORRECTION ICI
      navigate("/admin");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Email ou mot de passe incorrect."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex">

        {/* LEFT SIDE */}
        <div className="hidden md:flex w-1/2 bg-blue-900 text-white p-10 flex-col justify-between">

          <div>
            <div className="flex items-center gap-3 mb-10">
              <span className="text-3xl">🎓</span>
              <h1 className="text-2xl font-bold">LW Academy</h1>
            </div>

            <h2 className="text-4xl font-bold leading-tight mb-4">
              Welcome Back
            </h2>

            <p className="text-blue-100">
              Access your academic dashboard and continue your learning journey.
            </p>
          </div>

          <div className="text-sm text-blue-200">
            10k+ Active Scholars
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">

          <h2 className="text-3xl font-bold text-blue-900 mb-2">
            Sign In
          </h2>

          <p className="text-gray-500 mb-8">
            Enter your credentials to continue
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg p-3 mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="text-sm font-semibold text-gray-600">
                Email
              </label>

              <input
                type="email"
                value={email}
                required
                className="w-full border-b p-2 focus:outline-none focus:border-blue-600"
                placeholder="name@lw-academy.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">
                Password
              </label>

              <input
                type="password"
                value={password}
                required
                className="w-full border-b p-2 focus:outline-none focus:border-blue-600"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <input type="checkbox" />
              Keep me signed in
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition disabled:opacity-50"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>

          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-blue-900 font-semibold hover:underline">
              Créer un compte
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;