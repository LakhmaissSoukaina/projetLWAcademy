// src/pages/student/StudentCourses.jsx

const courses = [
  {
    id: 1,
    title: "Advanced Modern Philosophy",
    category: "Social Sciences",
    professor: "Prof. Elena Moretti",
    progress: 75,
    level: "Advanced",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  },
  {
    id: 2,
    title: "Classical Astronomy Systems",
    category: "Natural History",
    professor: "Dr. Julian Thorne",
    progress: 32,
    level: "Intermediate",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
  },
  {
    id: 3,
    title: "Foundation of Molecular Biology",
    category: "Applied Sciences",
    professor: "Prof. Sarah Jenkins",
    progress: 100,
    level: "Introductory",
    image: null,
    icon: "science",
  },
  {
    id: 4,
    title: "Principles of Urban Design",
    category: "Design",
    professor: "Arch. Marc Dubois",
    progress: 0,
    level: "Intermediate",
    image: null,
    icon: "architecture",
  },
  {
    id: 5,
    title: "Francophone Literature",
    category: "Literature",
    professor: "Dr. Amira Kabbaj",
    progress: 58,
    level: "Advanced",
    image: null,
    icon: "language",
  },
];

const StudentCourses = () => {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-blue-800 mb-2">
            My Courses
          </h1>

          <p className="text-gray-500 max-w-2xl">
            Continue your academic journey and track your progress
            through our specialized curriculum.
          </p>
        </div>

        <button className="bg-blue-700 hover:bg-blue-800 transition-all text-white px-6 py-4 rounded-2xl flex items-center gap-2 font-semibold shadow-lg">
          <span className="material-symbols-outlined">
            qr_code_scanner
          </span>

          Redeem Access Code
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 border-b border-gray-100 pb-6">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-600">
            Filter by:
          </span>

          <select className="bg-gray-100 px-5 py-3 rounded-full border-none focus:ring-2 focus:ring-blue-500">
            <option>All Subjects</option>
            <option>Mathematics</option>
            <option>Literature</option>
            <option>Sciences</option>
          </select>

          <select className="bg-gray-100 px-5 py-3 rounded-full border-none focus:ring-2 focus:ring-blue-500">
            <option>All Levels</option>
            <option>Introductory</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-gray-400">
            Showing {courses.length} courses
          </span>

          <button className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
            <span className="material-symbols-outlined">
              grid_view
            </span>
          </button>

          <button className="p-2 text-gray-400">
            <span className="material-symbols-outlined">
              view_list
            </span>
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">

        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-500 group"
          >

            {/* Image */}
            <div className="relative h-56 overflow-hidden">

              {course.image ? (
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                  <span className="material-symbols-outlined text-7xl text-blue-300">
                    {course.icon}
                  </span>
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

              {/* Level */}
              <span className="absolute top-4 left-4 bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                {course.level}
              </span>
            </div>

            {/* Content */}
            <div className="p-8">

              {/* Category */}
              <span className="text-xs uppercase tracking-widest text-blue-700 font-bold block mb-2">
                {course.category}
              </span>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-800 mb-5">
                {course.title}
              </h2>

              {/* Professor */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                  {course.professor[0]}
                </div>

                <span className="text-gray-500 font-medium">
                  {course.professor}
                </span>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-semibold text-gray-700">
                    Progress
                  </span>

                  <span className="font-bold text-blue-700">
                    {course.progress}%
                  </span>
                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-700 rounded-full"
                    style={{
                      width: `${course.progress}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Explore More Card */}
        <div className="border-2 border-dashed border-gray-300 rounded-3xl bg-white/50 flex flex-col items-center justify-center text-center p-10 hover:border-blue-700 transition-all cursor-pointer group min-h-[450px]">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6 group-hover:bg-blue-700 transition-all">
            <span className="material-symbols-outlined text-4xl text-gray-500 group-hover:text-white">
              add
            </span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Explore More
          </h2>

          <p className="text-gray-500 mb-6">
            Discover new subjects from our world-class faculty
          </p>

          <button className="text-blue-700 font-bold hover:underline">
            View Course Catalog
          </button>
        </div>

      </div>
    </div>
  );
};

export default StudentCourses;