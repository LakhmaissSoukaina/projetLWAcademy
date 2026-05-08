import { useState } from "react";
import { register } from "../../api/auth";
import { useNavigate, Link } from "react-router-dom";

function Register() {
    const [form, setForm] = useState({ email: "", password: "", nom: "", prenom: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="w-full max-w-6xl bg-white rounded-xl shadow-xl overflow-hidden flex">

                {/* LEFT SIDE */}
                <div className="hidden md:flex w-1/2 bg-blue-900 text-white p-10 flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-10">
                            <span className="text-3xl">🎓</span>
                            <h1 className="text-2xl font-bold">LW Academy</h1>
                        </div>
                        <h2 className="text-4xl font-bold leading-tight mb-4">
                            Join Our Academic Community
                        </h2>
                        <p className="text-blue-100">
                            Create your account and start your academic journey today.
                        </p>
                    </div>
                    <div className="text-sm text-blue-200">10k+ Active Scholars</div>
                </div>

                {/* RIGHT SIDE */}
                <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-blue-900 mb-2">Create Account</h2>
                    <p className="text-gray-500 mb-8">Fill in your details to get started</p>

                    {error && (
                        <div className="bg-red-50 text-red-600 border border-red-200 rounded p-3 mb-4 text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 text-green-600 border border-green-200 rounded p-3 mb-4 text-sm">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="text-sm font-semibold text-gray-600">Prénom</label>
                                <input
                                    type="text"
                                    name="prenom"
                                    className="w-full border-b p-2 focus:outline-none focus:border-blue-600"
                                    placeholder="Votre prénom"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="text-sm font-semibold text-gray-600">Nom</label>
                                <input
                                    type="text"
                                    name="nom"
                                    className="w-full border-b p-2 focus:outline-none focus:border-blue-600"
                                    placeholder="Votre nom"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-600">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full border-b p-2 focus:outline-none focus:border-blue-600"
                                placeholder="name@lw-academy.com"
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-600">Mot de passe</label>
                            <input
                                type="password"
                                name="password"
                                className="w-full border-b p-2 focus:outline-none focus:border-blue-600"
                                placeholder="••••••••"
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition disabled:opacity-50"
                        >
                            {loading ? "Création en cours..." : "Créer mon compte"}
                        </button>

                        <p className="text-center text-sm text-gray-500">
                            Déjà un compte ?{" "}
                            <Link to="/login" className="text-blue-900 font-semibold hover:underline">
                                Se connecter
                            </Link>
                        </p>
                    </form>

                    <div className="mt-8 text-xs text-gray-400 flex justify-between">
                        <span>© 2024 LW Academy</span>
                        <div className="flex gap-4">
                            <span>Privacy</span>
                            <span>Terms</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;