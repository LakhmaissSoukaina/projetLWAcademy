// frontend/src/pages/auth/Register.jsx
import { useState } from "react";
import { register } from "../../api/auth";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [form, setForm]     = useState({ email: "", password: "", nom: "", prenom: "" });
  const [error, setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await register(form);
      setSuccess("Compte créé ! Vérifiez votre email pour l'activer.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
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
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80"
              alt="Academic"
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            />
          </div>

          {/* Top */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <span className="material-symbols-outlined text-4xl">school</span>
              <h1 className="text-2xl font-bold tracking-tight font-['Noto_Serif']">LW Academy</h1>
            </div>
            <div className="space-y-6">
              <h2 className="text-5xl font-bold leading-tight font-['Noto_Serif']">
                Join Our Academic<br />Community.
              </h2>
              <p className="text-lg text-blue-200 opacity-90 max-w-md">
                Create your account and start your academic journey today. A bilingual curriculum awaits you.
              </p>
            </div>
          </div>

          {/* Steps indicator */}
          <div className="relative z-10 space-y-4">
            {[
              { n: 1, label: "Personal Details",  active: true },
              { n: 2, label: "Academic Level",    active: false },
              { n: 3, label: "Interests",         active: false },
            ].map(({ n, label, active }) => (
              <div key={n} className={`flex items-center gap-3 ${active ? "" : "opacity-40"}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${active ? "bg-white text-[#00288e]" : "bg-white/20 text-white"}`}>
                  {n}
                </span>
                <span className={`text-sm font-semibold ${active ? "text-white" : "text-blue-200"}`}>{label}</span>
              </div>
            ))}
            <div className="pt-4 text-xs text-blue-300 uppercase tracking-widest font-bold">
              10k+ Active Scholars
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
              <span className="text-xs text-gray-400">Already a member?</span>
              <Link to="/login" className="text-sm font-bold text-[#00288e] hover:underline">Sign In</Link>
            </div>
          </div>

          <div className="flex-grow flex flex-col justify-center">
            {/* Heading */}
            <div className="mb-8">
              <h3 className="text-4xl font-semibold text-[#00288e] mb-1 font-['Noto_Serif']">Create Account</h3>
              <p className="text-gray-500">Fill in your details to get started.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-gray-100 mb-8">
              <Link to="/login" className="text-sm font-semibold pb-3 text-gray-400 hover:text-gray-600 transition-colors">Login</Link>
              <button className="text-sm font-bold pb-3 border-b-2 border-[#00288e] text-[#00288e] -mb-px">Sign Up</button>
            </div>

            {/* Alerts */}
            {error && (
              <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-3 mb-6 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 text-green-700 border border-green-200 rounded-lg px-4 py-3 mb-6 text-sm">
                {success}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Prénom</label>
                  <input
                    type="text"
                    name="prenom"
                    required
                    onChange={handleChange}
                    placeholder="Votre prénom"
                    className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:ring-0 focus:border-[#00288e] bg-transparent transition-all text-sm placeholder:text-gray-300 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Nom</label>
                  <input
                    type="text"
                    name="nom"
                    required
                    onChange={handleChange}
                    placeholder="Votre nom"
                    className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:ring-0 focus:border-[#00288e] bg-transparent transition-all text-sm placeholder:text-gray-300 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Institutional Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  onChange={handleChange}
                  placeholder="name@lw-academy.com"
                  className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:ring-0 focus:border-[#00288e] bg-transparent transition-all text-sm placeholder:text-gray-300 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  required
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:ring-0 focus:border-[#00288e] bg-transparent transition-all text-sm outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00288e] text-white py-4 rounded-lg text-sm font-bold hover:bg-[#1e40af] transition-all shadow-lg shadow-blue-900/10 disabled:opacity-50 mt-2"
              >
                {loading ? "Création en cours..." : "Create My Account"}
              </button>
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
              <button className="text-[#00288e] font-bold text-sm underline whitespace-nowrap">Register</button>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-6 border-t border-gray-100 flex justify-between text-xs text-gray-400">
            <p>© 2024 LW Academy. All rights reserved.</p>
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

export default Register;