// src/pages/student/StudentAssignment.jsx

export default function StudentAssignment() {
  const assignments = [
    {
      title: "Analyse Comparative: Voltaire vs Rousseau",
      description:
        "Rédiger un essai de 1500 mots sur la notion de contrat social.",
      deadline: "15 Oct 2023",
      status: "À Faire",
      action: "Déposer PDF",
      color: "blue",
    },
    {
      title: "Probabilités et Statistiques Appliquées",
      description:
        "Résolution de la série d'exercices n°4 sur les variables aléatoires.",
      deadline: "08 Oct 2023",
      status: "Soumis",
      action: "En attente de correction",
      color: "gray",
    },
    {
      title: "Histoire de l'Art: Le Modernisme",
      description:
        "Exposé sur l'influence du Bauhaus dans l'architecture contemporaine.",
      deadline: "28 Sep 2023",
      status: "Noté",
      action: "18/20",
      color: "green",
    },
    {
      title: "Anglais Académique: Dissertation",
      description:
        "Research paper on linguistic relativity in global communications.",
      deadline: "01 Oct 2023",
      status: "En Retard",
      action: "Remettre tardivement",
      color: "red",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#141b2b]">
      <main className="max-w-[1440px] mx-auto px-6 py-8">
        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 mb-12 text-sm text-gray-500">
          <span>Dashboard</span>
          <span>›</span>

          <span className="text-blue-800 font-semibold">
            Assignments
          </span>
        </nav>

        {/* HEADER */}
        <header className="mb-12">
          <h1 className="text-6xl font-bold text-blue-900 mb-6">
            Gestion des Devoirs
          </h1>

          <p className="text-2xl text-gray-500 max-w-3xl leading-relaxed">
            Consultez vos travaux en cours, téléchargez vos
            documents et suivez vos résultats académiques.
          </p>
        </header>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-3xl shadow-sm p-8 border-l-4 border-blue-700">
            <p className="uppercase tracking-widest text-sm text-gray-400 mb-4">
              À Terminer
            </p>

            <div className="flex items-end gap-3">
              <span className="text-6xl font-bold text-blue-900">
                04
              </span>

              <span className="text-gray-500 mb-2">
                Devoirs actifs
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm p-8 border-l-4 border-gray-700">
            <p className="uppercase tracking-widest text-sm text-gray-400 mb-4">
              Moyenne Générale
            </p>

            <div className="flex items-end gap-3">
              <span className="text-6xl font-bold text-gray-900">
                16.5
              </span>

              <span className="text-gray-500 mb-2">
                / 20
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm p-8 relative overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/aida/ADBb0uh-gORIA9_i2XBTfcBGNH7GvGK61nvpvmamftY8UYejNeuJ-2gn1laSL1vEXhF7sdvLuNjY6Ao8oUTl9IRE6MhxfYT2pJH4XYXbSfGEsrOug-CNxULYOog7_nWuCzv64tq-a6oa4MgiBYoPMBgiwf2DlOau_PG8OJajScH80sbddx4qabkfJEDRk2dHvVy5ZE20y7duE3gTvaK9WrkaJUfQwjkusg1lP4OD2T-LWZjynbzUqBPF8VoDkQ5CmN3iGB6gv7Vt-3sIyA"
              alt="Study"
              className="absolute inset-0 w-full h-full object-cover opacity-10"
            />

            <div className="relative z-10">
              <p className="uppercase tracking-widest text-sm text-gray-400 mb-4">
                Prochain Délai
              </p>

              <p className="text-3xl font-bold">
                Philosophie Appliquée
              </p>

              <p className="text-red-500 font-semibold mt-3 text-lg">
                Dans 2 jours
              </p>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-3xl font-bold text-blue-900">
              Liste des Travaux
            </h3>

            <button className="px-5 py-3 rounded-xl border border-blue-700 text-blue-700 hover:bg-blue-50 transition">
              🔍 Filtrer
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm uppercase tracking-widest text-gray-400">
                  <th className="px-8 py-5">
                    Titre & Instruction
                  </th>

                  <th className="px-8 py-5">
                    Date Limite
                  </th>

                  <th className="px-8 py-5">
                    Statut
                  </th>

                  <th className="px-8 py-5">
                    Action / Note
                  </th>
                </tr>
              </thead>

              <tbody>
                {assignments.map((item, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-100 hover:bg-blue-50/30 transition"
                  >
                    <td className="px-8 py-6">
                      <div>
                        <h4 className="font-bold text-lg mb-2">
                          {item.title}
                        </h4>

                        <p className="text-gray-500">
                          {item.description}
                        </p>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-gray-500">
                        <span>📅</span>

                        <span>{item.deadline}</span>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <span
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase
                        ${
                          item.color === "blue"
                            ? "bg-blue-100 text-blue-700"
                            : item.color === "gray"
                            ? "bg-gray-200 text-gray-700"
                            : item.color === "green"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-8 py-6">
                      {item.status === "Noté" ? (
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold">
                            {item.action}
                          </span>

                          <button className="hover:scale-110 transition">
                            👁
                          </button>
                        </div>
                      ) : (
                        <button
                          className={`font-semibold hover:underline ${
                            item.color === "red"
                              ? "text-red-500"
                              : "text-blue-700"
                          }`}
                        >
                          {item.status === "À Faire" && "📤 "}
                          {item.status === "En Retard" && "🕒 "}
                          {item.action}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="p-8 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Affichage de 4 devoirs sur 12
            </p>

            <div className="flex gap-3">
              <button className="w-10 h-10 rounded-lg border border-gray-200 hover:bg-white transition">
                ←
              </button>

              <button className="w-10 h-10 rounded-lg border border-gray-200 hover:bg-white transition">
                →
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* HELP BUTTON */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center text-2xl hover:scale-105 transition">
        🎧
      </button>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-gray-100 py-10 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="font-bold text-blue-900 uppercase tracking-widest">
              LW Academy
            </span>

            <span className="text-sm text-gray-400">
              © 2024 Excellence in Education.
            </span>
          </div>

          <div className="flex gap-8 text-sm text-gray-500">
            <a href="#" className="hover:text-blue-700">
              Privacy Policy
            </a>

            <a href="#" className="hover:text-blue-700">
              Academic Integrity
            </a>

            <a href="#" className="hover:text-blue-700">
              System Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}