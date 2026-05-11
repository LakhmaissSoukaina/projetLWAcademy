// src/pages/RegisterProfessor.jsx
import { useState } from "react";
import { submitProfessorApplication } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterProfessor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    phone: "",
    diploma: "",
    experience: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await submitProfessorApplication(formData);
      setSuccess(true);
    } catch (error) {
      console.error("Error:", error);
      const errorMsg = error.response?.data?.error || "Erreur lors de l'envoi de votre candidature";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#f9f9ff] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-green-600 text-3xl">check</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Candidature envoyée !</h2>
          <p className="text-gray-500 mb-6">
            Votre demande a bien été prise en compte. 
            Vous serez notifié par email une fois votre compte approuvé par l'administrateur.
          </p>
          <Link
            to="/login"
            className="inline-block bg-blue-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 transition"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9ff] py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">W.CENTRE</h1>
          <p className="text-gray-500">Devenir Professeur</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Formulaire de candidature</h2>
          <p className="text-gray-500 mb-6">
            Remplissez ce formulaire pour postuler en tant que professeur. 
            Votre demande sera examinée par notre équipe.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Dupont"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Jean"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="jean.dupont@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="06 12 34 56 78"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Diplômes et qualifications
              </label>
              <textarea
                name="diploma"
                value={formData.diploma}
                onChange={handleChange}
                rows="3"
                placeholder="Décrivez vos diplômes, certifications et formations..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Expérience professionnelle
              </label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                rows="3"
                placeholder="Décrivez votre expérience dans l'enseignement..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
              />
            </div>

            <div className="bg-blue-50 rounded-xl p-4 text-sm text-gray-600">
              <p className="font-semibold text-blue-800 mb-1">Informations</p>
              <p>Votre candidature sera étudiée par notre équipe. Vous recevrez une réponse par email sous 48h.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-900 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Envoi en cours..." : "Envoyer ma candidature"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Vous avez déjà un compte ?{" "}
            <Link to="/login" className="text-blue-700 hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}