import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="bg-[#f9f9ff] text-[#141b2b] min-h-screen overflow-x-hidden">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center h-16 px-8 sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">

        <div className="flex items-center gap-12">

          <h1 className="text-2xl font-black text-blue-900 font-serif">
            LW Academy
          </h1>

          <div className="hidden md:flex gap-8">

            <Link
              to="/"
              className="text-blue-900 font-semibold border-b-2 border-blue-900 pb-1"
            >
              Home
            </Link>

            <a
              href="#features"
              className="text-gray-500 hover:text-blue-900 transition"
            >
              Features
            </a>

            <a
              href="#about"
              className="text-gray-500 hover:text-blue-900 transition"
            >
              About
            </a>

            <a
              href="#contact-form"
              className="text-gray-500 hover:text-blue-900 transition"
            >
              Contact
            </a>

          </div>
        </div>

        {/* AUTH BUTTONS */}
        <div className="flex items-center gap-4">

          <Link to="/login">
            <button className="px-5 py-2 rounded-full border border-gray-200 text-sm font-semibold hover:bg-gray-50 transition">
              Login
            </button>
          </Link>

          <Link to="/register">
            <button className="px-5 py-2 rounded-full bg-blue-900 text-white text-sm font-semibold shadow-lg hover:bg-blue-800 transition">
              Get Started
            </button>
          </Link>

        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-[88vh] flex items-center px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div>

            <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-900 text-sm font-bold mb-6">
              Premium Academic Platform
            </span>

            <h1 className="text-5xl lg:text-6xl font-black leading-tight font-serif text-blue-950">
              Votre plateforme d’apprentissage nouvelle génération
            </h1>

            <p className="mt-8 text-lg text-gray-500 leading-relaxed max-w-xl">
              Cours en direct, intelligence artificielle, tutorat personnalisé,
              bibliothèque numérique et suivi académique avancé réunis dans
              un seul écosystème moderne.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">

              <Link to="/register">
                <button className="px-8 py-4 bg-blue-900 text-white rounded-xl font-bold shadow-lg hover:bg-blue-800 transition">
                  Commencer
                </button>
              </Link>

              <button className="px-8 py-4 border border-gray-300 rounded-xl font-bold hover:bg-white transition">
                Découvrir
              </button>

            </div>

            {/* STATS */}
            <div className="flex gap-10 mt-14 flex-wrap">

              <div>
                <h3 className="text-3xl font-black text-blue-900">120K+</h3>
                <p className="text-gray-500 text-sm mt-1">Étudiants</p>
              </div>

              <div>
                <h3 className="text-3xl font-black text-blue-900">800+</h3>
                <p className="text-gray-500 text-sm mt-1">Professeurs</p>
              </div>

              <div>
                <h3 className="text-3xl font-black text-blue-900">1.8K</h3>
                <p className="text-gray-500 text-sm mt-1">Cours</p>
              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="relative">

            <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30"></div>

            <div className="relative bg-white p-6 rounded-3xl shadow-2xl border border-gray-100">

              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                alt="Students"
                className="rounded-2xl w-full h-[500px] object-cover"
              />

              {/* FLOATING CARD */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-xl border border-gray-100 flex items-center gap-4">

                <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center text-white">
                  <span className="material-symbols-outlined">
                    psychology
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-blue-950">
                    Tutorat IA
                  </h4>

                  <p className="text-sm text-gray-500">
                    Assistance intelligente 24/7
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-28 px-8">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-20">
            <h2 className="text-4xl font-black font-serif text-blue-950 mb-5">
              Une plateforme conçue pour l’excellence
            </h2>

            <p className="text-gray-500 max-w-2xl mx-auto">
              Une expérience moderne pensée pour les étudiants,
              professeurs et administrateurs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition">

              <span className="material-symbols-outlined text-blue-900 text-5xl mb-6 block">
                live_tv
              </span>

              <h3 className="text-xl font-bold mb-4">
                Cours en Direct
              </h3>

              <p className="text-gray-500">
                Streaming HD interactif avec suivi temps réel.
              </p>

            </div>

            <div className="bg-blue-900 text-white p-8 rounded-3xl shadow-xl">

              <span className="material-symbols-outlined text-5xl mb-6 block">
                auto_awesome
              </span>

              <h3 className="text-xl font-bold mb-4">
                Intelligence Artificielle
              </h3>

              <p className="text-blue-100">
                Assistant intelligent intégré à la plateforme.
              </p>

            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition">

              <span className="material-symbols-outlined text-blue-900 text-5xl mb-6 block">
                groups
              </span>

              <h3 className="text-xl font-bold mb-4">
                Coaching
              </h3>

              <p className="text-gray-500">
                Suivi personnalisé pour chaque étudiant.
              </p>

            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition">

              <span className="material-symbols-outlined text-blue-900 text-5xl mb-6 block">
                analytics
              </span>

              <h3 className="text-xl font-bold mb-4">
                Analytics
              </h3>

              <p className="text-gray-500">
                Rapports détaillés et progression intelligente.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-28 px-8 bg-white">

        <div className="max-w-6xl mx-auto text-center">

          <h2 className="text-4xl font-black font-serif text-blue-950 mb-8">
            À propos de LW Academy
          </h2>

          <p className="text-lg text-gray-500 leading-relaxed max-w-4xl mx-auto">
            LW Academy est une plateforme éducative moderne conçue pour offrir
            une expérience d’apprentissage premium aux étudiants et enseignants.
            Notre mission est de combiner technologie, intelligence artificielle
            et excellence académique afin de transformer l’éducation numérique.
          </p>

        </div>

      </section>

      {/* CONTACT SECTION */}
      <section
        id="contact-form"
        className="py-24 px-8 bg-[#f9f9ff]"
      >

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div>

            <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-900 text-sm font-bold mb-6">
              Contactez-nous
            </span>

            <h2 className="text-4xl font-black font-serif text-blue-950 leading-tight mb-6">
              Parlons de votre avenir académique
            </h2>

            <p className="text-gray-500 text-lg leading-relaxed mb-10">
              Une question ? Un partenariat ? Besoin d’assistance ?
              Notre équipe vous répond rapidement pour vous accompagner.
            </p>

            <div className="space-y-6">

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white flex items-center justify-center">
                  <span className="material-symbols-outlined">
                    mail
                  </span>
                </div>

                <div>
                  <p className="font-bold text-blue-950">
                    Email
                  </p>

                  <p className="text-gray-500">
                    contact@lwacademy.com
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white flex items-center justify-center">
                  <span className="material-symbols-outlined">
                    call
                  </span>
                </div>

                <div>
                  <p className="font-bold text-blue-950">
                    Téléphone
                  </p>

                  <p className="text-gray-500">
                    +212 6 00 00 00 00
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white flex items-center justify-center">
                  <span className="material-symbols-outlined">
                    location_on
                  </span>
                </div>

                <div>
                  <p className="font-bold text-blue-950">
                    Adresse
                  </p>

                  <p className="text-gray-500">
                    Casablanca, Maroc
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* RIGHT FORM */}
          <div className="bg-white rounded-[32px] shadow-2xl p-10 border border-gray-100">

            <form className="space-y-6">

              <div>
                <label className="block text-sm font-bold text-blue-950 mb-3">
                  Nom complet
                </label>

                <input
                  type="text"
                  placeholder="Votre nom"
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-blue-950 mb-3">
                  Adresse Email
                </label>

                <input
                  type="email"
                  placeholder="example@email.com"
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-blue-950 mb-3">
                  Sujet
                </label>

                <input
                  type="text"
                  placeholder="Sujet"
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-blue-950 mb-3">
                  Message
                </label>

                <textarea
                  rows="5"
                  placeholder="Votre message..."
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-blue-900 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-800 transition"
              >
                Envoyer le message
              </button>

            </form>

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-10 px-8 bg-white">

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6">

          <div>

            <h3 className="text-2xl font-black text-blue-900 font-serif">
              LW Academy
            </h3>

            <p className="text-gray-500 mt-3">
              Excellence académique moderne.
            </p>

          </div>

          <div className="flex gap-8 text-gray-500 text-sm">

            <a href="#" className="hover:text-blue-900 transition">
              Privacy
            </a>

            <a href="#" className="hover:text-blue-900 transition">
              Terms
            </a>

            <a href="#" className="hover:text-blue-900 transition">
              Contact
            </a>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default LandingPage;