import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AdminLayout from "../components/layout/AdminLayout";

function Home() {

  const { user, logout } =
    useContext(AuthContext);

  const stats = [
    {
      title: "Total Users",
      value: "124,582",
      icon: "group",
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Courses",
      value: "1,240",
      icon: "menu_book",
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Teachers",
      value: "340",
      icon: "groups",
      color: "bg-orange-100 text-orange-700",
    },
    {
      title: "Live Sessions",
      value: "86",
      icon: "live_tv",
      color: "bg-pink-100 text-pink-700",
    },
  ];

  return (
    <AdminLayout>

      {/* HEADER */}
      <div className="mb-10">

        <h1 className="text-4xl font-bold text-blue-900 mb-3">
          Global Supervision
        </h1>

        <p className="text-gray-500 text-lg">
          Welcome back {user?.prenom}
        </p>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {stats.map((item) => (

          <div
            key={item.title}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >

            <div className="flex items-center justify-between mb-5">

              <div className={`p-3 rounded-xl ${item.color}`}>

                <span className="material-symbols-outlined">
                  {item.icon}
                </span>

              </div>

              <span className="text-sm text-green-500 font-semibold">
                +12%
              </span>

            </div>

            <p className="text-gray-400 text-sm mb-2">
              {item.title}
            </p>

            <h2 className="text-3xl font-bold">
              {item.value}
            </h2>

          </div>

        ))}

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-10 overflow-hidden">

        <div className="p-6 border-b border-gray-100 flex justify-between items-center">

          <h2 className="text-xl font-bold">
            User Management
          </h2>

          <button className="bg-blue-900 text-white px-5 py-2 rounded-xl">
            Add User
          </button>

        </div>

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr className="text-left text-gray-500 text-sm">

              <th className="p-5">User</th>
              <th className="p-5">Role</th>
              <th className="p-5">Status</th>
              <th className="p-5">Actions</th>

            </tr>

          </thead>

          <tbody>

            {[1,2,3].map((item) => (

              <tr
                key={item}
                className="border-t border-gray-100 hover:bg-gray-50"
              >

                <td className="p-5">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full bg-blue-100"></div>

                    <div>

                      <p className="font-semibold">
                        John Doe
                      </p>

                      <p className="text-sm text-gray-400">
                        john@example.com
                      </p>

                    </div>

                  </div>

                </td>

                <td className="p-5">
                  Admin
                </td>

                <td className="p-5">

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    Active
                  </span>

                </td>

                <td className="p-5">

                  <div className="flex gap-3">

                    <button className="text-blue-600">
                      Edit
                    </button>

                    <button className="text-red-500">
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* BUTTON LOGOUT */}
      <div className="mt-10">

        <button
          onClick={logout}
          className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition"
        >
          Logout
        </button>

      </div>

    </AdminLayout>
  );
}

export default Home;