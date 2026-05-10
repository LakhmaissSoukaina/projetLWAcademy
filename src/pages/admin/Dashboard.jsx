// src/pages/admin/Dashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getUsers, getAdminStats } from "../../api/adminApi";

export default function Dashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingProfs: 0,
    activeCourses: 0,
    liveSessions: 0
  });
  const [loading, setLoading] = useState(true);
  const [pendingProfs, setPendingProfs] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const usersData = await getUsers();
      setUsers(usersData);
      
      // Calculer les stats
      const professors = usersData.filter(u => u.roles?.includes('ROLE_PROF'));
      const pendingProfessors = professors.filter(p => !p.isVerified);
      
      setStats({
        totalUsers: usersData.length,
        pendingProfs: pendingProfessors.length,
        activeCourses: 1894, // À remplacer par API réelle
        liveSessions: 86       // À remplacer par API réelle
      });
      
      // Transformer les professeurs en attente pour le tableau
      setPendingProfs(pendingProfessors.map(prof => ({
        id: prof.id,
        name: `${prof.prenom || ''} ${prof.nom || ''}`.trim(),
        specialization: "À déterminer",
        time: new Date(prof.createdAt).toLocaleDateString(),
        initials: `${(prof.prenom?.charAt(0) || '')}${(prof.nom?.charAt(0) || '')}`,
        initialsColor: "bg-blue-100 text-blue-800",
        document: "pending_verification.pdf"
      })));
      
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (roles) => {
    if (roles?.includes('ROLE_ADMIN')) return "Admin";
    if (roles?.includes('ROLE_PROF')) return "Professor";
    if (roles?.includes('ROLE_TUTEUR')) return "Tutor";
    if (roles?.includes('ROLE_ETUDIANT')) return "Student";
    return "User";
  };

  const getStatusBadge = (isVerified) => {
    return isVerified ? "Active" : "Pending";
  };

  const getStatusColor = (isVerified) => {
    return isVerified ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600";
  };

  const getAvatarColor = (roles) => {
    if (roles?.includes('ROLE_ADMIN')) return "bg-blue-900 text-white";
    if (roles?.includes('ROLE_PROF')) return "bg-blue-100 text-blue-800";
    if (roles?.includes('ROLE_TUTEUR')) return "bg-amber-100 text-amber-800";
    return "bg-gray-100 text-gray-600";
  };

  const getInitials = (user) => {
    return `${(user.prenom?.charAt(0) || '')}${(user.nom?.charAt(0) || '')}`;
  };

  const getLastActivity = (user) => {
    // Simuler une activité - à remplacer par des données réelles
    const hours = Math.floor(Math.random() * 24);
    if (hours === 0) return "Just now";
    if (hours < 2) return `${hours} hour ago`;
    return `${hours} hours ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  const recentUsers = users.slice(0, 5).map(u => ({
    id: u.id,
    name: `${u.prenom || ''} ${u.nom || ''}`.trim(),
    email: u.email,
    role: getRoleLabel(u.roles),
    activity: getLastActivity(u),
    status: getStatusBadge(u.isVerified),
    avatar: getInitials(u),
    avatarColor: getAvatarColor(u.roles)
  }));

  const hierarchy = [
    {
      title: "Baccalaureate - Scientific",
      subjects: 12,
      modules: 450,
      subLevels: [
        { name: "Terminal Grade", count: 180 },
        { name: "Première Grade", count: 150 },
        { name: "Seconde Grade", count: 120 }
      ]
    },
    {
      title: "Baccalaureate - Arts",
      subjects: 8,
      modules: 310,
      subLevels: [
        { name: "Terminal Grade", count: 120 },
        { name: "Première Grade", count: 100 },
        { name: "Seconde Grade", count: 90 }
      ]
    }
  ];

  const systemFlags = [
    { id: 1, type: "Copyright Claim", description: "Math-101 Module 4 Video", icon: "report", color: "rose", action: "REVIEW CONTENT" },
    { id: 2, type: "Reported Comment", description: "Thread: Arabic Literature Intro", icon: "forum", color: "amber", action: "MODERATE" },
    { id: 3, type: "Exam Verification", description: "Q3 Results Distribution Shift", icon: "task", color: "blue", action: "ANALYZE DATA" }
  ];

  return (
    <div className="space-y-6 w-full max-w-full">
      
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-2 font-serif">
          Global Supervision
        </h1>
        <p className="text-gray-500 text-base lg:text-lg max-w-2xl">
          Manage your educational ecosystem with precision. Real-time insights and administrative controls for LW Academy's global operations.
        </p>
      </div>

      {/* KPI Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white p-5 lg:p-6 rounded-xl shadow-sm border border-gray-50 hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-blue-50 rounded-lg text-blue-800">
              <span className="material-symbols-outlined">group</span>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
          </div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">Total Users</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-5 lg:p-6 rounded-xl shadow-sm border border-gray-50 hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-amber-50 rounded-lg text-amber-600">
              <span className="material-symbols-outlined">person_search</span>
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Urgent</span>
          </div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">Pending Profs</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.pendingProfs}</h3>
        </div>

        <div className="bg-white p-5 lg:p-6 rounded-xl shadow-sm border border-gray-50 hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600">
              <span className="material-symbols-outlined">auto_stories</span>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Active</span>
          </div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">Active Courses</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.activeCourses.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-5 lg:p-6 rounded-xl shadow-sm border border-gray-50 hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-rose-50 rounded-lg text-rose-600">
              <span className="material-symbols-outlined">sensors</span>
            </div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full animate-pulse">Live Now</span>
          </div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">Live Sessions</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.liveSessions}</h3>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* User Management Table */}
        <div className="xl:col-span-8 bg-white rounded-xl shadow-sm border border-gray-50 overflow-hidden">
          <div className="p-5 lg:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 font-serif">User Management</h3>
            <div className="flex gap-2 flex-wrap">
              <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
                <span className="material-symbols-outlined text-sm">filter_list</span>
                Filter
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
                <span className="material-symbols-outlined text-sm">download</span>
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-1.5 bg-blue-900 text-white rounded-lg text-xs font-bold hover:bg-blue-800 shadow-sm">
                <span className="material-symbols-outlined text-sm">add</span>
                Add User
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-4 font-semibold">User Identity</th>
                  <th className="px-5 py-4 font-semibold">Role</th>
                  <th className="px-5 py-4 font-semibold">Activity</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentUsers.map((userItem) => (
                  <tr key={userItem.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${userItem.avatarColor}`}>
                          {userItem.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{userItem.name}</p>
                          <p className="text-xs text-gray-400">{userItem.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{userItem.role}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{userItem.activity}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${userItem.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {userItem.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all">
                          <span className="material-symbols-outlined text-lg">block</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/30">
            <span className="text-xs text-gray-400">Showing {recentUsers.length} of {stats.totalUsers} users</span>
            <div className="flex gap-1">
              <button className="px-3 py-1 text-xs text-gray-400 hover:text-gray-600" disabled>Prev</button>
              <button className="px-3 py-1 text-xs text-blue-900 font-bold bg-blue-50 rounded">1</button>
              <button className="px-3 py-1 text-xs text-gray-400 hover:text-gray-600">Next</button>
            </div>
          </div>
        </div>

        {/* Professor Validation */}
        <div className="xl:col-span-4 bg-white rounded-xl shadow-sm border border-gray-50 p-5 lg:p-6">
          <div className="mb-5 flex justify-between items-center">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 font-serif">Professor Validation</h3>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-1 rounded-full">
              {pendingProfs.length} PENDING
            </span>
          </div>
          
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {pendingProfs.map((prof) => (
              <div key={prof.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${prof.initialsColor}`}>
                      {prof.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{prof.name}</p>
                      <p className="text-[10px] text-gray-400">Specialization: {prof.specialization}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 flex-shrink-0">{prof.time}</span>
                </div>
                
                <div className="flex items-center gap-2 mb-4 bg-white p-2 rounded-lg border border-gray-100">
                  <span className="material-symbols-outlined text-blue-600 text-sm flex-shrink-0">description</span>
                  <span className="text-xs text-gray-500 truncate">{prof.document}</span>
                  <button className="ml-auto material-symbols-outlined text-gray-400 hover:text-blue-600 transition-colors text-lg flex-shrink-0">
                    visibility
                  </button>
                </div>
                
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-900 text-white text-[11px] font-bold py-2.5 rounded-lg hover:bg-blue-800 transition-all">
                    APPROVE
                  </button>
                  <button className="flex-1 border border-red-200 text-red-600 text-[11px] font-bold py-2.5 rounded-lg hover:bg-red-50 transition-all">
                    DENY
                  </button>
                </div>
              </div>
            ))}
            {pendingProfs.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <span className="material-symbols-outlined text-4xl">check_circle</span>
                <p className="mt-2 text-sm">No pending professors</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Second Row (reste identique avec les données) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Pedagogical Hierarchy */}
        <div className="xl:col-span-5 bg-white rounded-xl shadow-sm border border-gray-50 p-5 lg:p-6">
          <div className="mb-5 flex justify-between items-center">
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 font-serif">Pedagogical Hierarchy</h3>
              <p className="text-xs text-gray-400 mt-1">Manage curriculum branches</p>
            </div>
            <button className="p-2 bg-blue-50 text-blue-800 rounded-full hover:bg-blue-100 transition-colors">
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
          
          <div className="space-y-4">
            {hierarchy.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-xl border border-blue-100 hover:bg-blue-50 transition-colors cursor-pointer gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="material-symbols-outlined text-blue-800">folder_open</span>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{item.title}</p>
                      <p className="text-xs text-gray-400">{item.subjects} Subjects | {item.modules} Modules</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 cursor-pointer hover:text-blue-600">more_vert</span>
                </div>
                
                <div className="ml-4 sm:ml-6 border-l-2 border-gray-100 pl-4 space-y-2">
                  {item.subLevels.map((sub, subIndex) => (
                    <div key={subIndex} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-blue-200 transition-all gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="material-symbols-outlined text-gray-400 text-base">subdirectory_arrow_right</span>
                        <p className="font-medium text-gray-700 text-sm truncate">{sub.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{sub.count}</span>
                        <span className="material-symbols-outlined text-gray-400 hover:text-blue-600 cursor-pointer text-base">edit</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-7 space-y-6">
          {/* Weekly Engagement */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-50 p-5 lg:p-6">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-1 font-serif">Weekly Engagement</h3>
            <p className="text-xs text-gray-400 mb-6">Real-time system resource allocation</p>
            
            <div className="mb-6">
              <svg className="w-full h-32" viewBox="0 0 400 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(30,64,175,0.2)" />
                    <stop offset="100%" stopColor="rgba(30,64,175,0)" />
                  </linearGradient>
                </defs>
                <path d="M0,80 Q50,70 100,60 T200,40 T300,50 T400,20 L400,100 L0,100 Z" fill="url(#gradient)" />
                <path d="M0,80 Q50,70 100,60 T200,40 T300,50 T400,20" fill="none" stroke="#1e40af" strokeWidth="2" />
                <circle cx="100" cy="60" r="3" fill="#1e40af" />
                <circle cx="200" cy="40" r="3" fill="#1e40af" />
                <circle cx="300" cy="50" r="3" fill="#1e40af" />
                <circle cx="400" cy="20" r="3" fill="#1e40af" />
              </svg>
              <div className="flex justify-between text-[10px] text-gray-400 mt-2 px-1">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Server Load</p>
                <p className="text-xl font-bold text-gray-900">24.8%</p>
                <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2">
                  <div className="bg-blue-800 h-full w-[25%] rounded-full" />
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Active Streams</p>
                <p className="text-xl font-bold text-gray-900">142</p>
                <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2">
                  <div className="bg-emerald-500 h-full w-[65%] rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Broadcast Notification */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-50 p-5 lg:p-6">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-5 font-serif">Broadcast Notification</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Target Audience</label>
                  <select className="w-full border-gray-200 rounded-lg text-sm p-2.5 border bg-gray-50 focus:ring-2 focus:ring-blue-800 outline-none">
                    <option>All Users</option>
                    <option>Professors Only</option>
                    <option>Students Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Priority Level</label>
                  <select className="w-full border-gray-200 rounded-lg text-sm p-2.5 border bg-gray-50 focus:ring-2 focus:ring-blue-800 outline-none">
                    <option>Low (Info)</option>
                    <option>Medium (Reminder)</option>
                    <option>High (Urgent)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message Content</label>
                <textarea 
                  className="w-full border-gray-200 rounded-lg text-sm p-3 border bg-gray-50 focus:ring-2 focus:ring-blue-800 outline-none resize-none" 
                  placeholder="Type your global announcement here..." 
                  rows="3"
                />
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <p className="text-xs text-gray-400">Scheduled for: Immediate delivery</p>
                <button 
                  type="button"
                  className="flex items-center gap-2 bg-blue-900 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20"
                >
                  <span className="material-symbols-outlined text-lg">send</span>
                  Send Global Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Content Supervision */}
      <section>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-2xl lg:text-3xl font-bold text-blue-900 font-serif">Content Supervision</h3>
          <div className="flex gap-2">
            <button className="bg-white border border-gray-200 p-2 rounded-lg hover:bg-gray-50 shadow-sm">
              <span className="material-symbols-outlined">refresh</span>
            </button>
            <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-50 shadow-sm flex items-center gap-2">
              View All Flags <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {systemFlags.map((flag) => (
            <div key={flag.id} className="bg-white p-5 lg:p-6 rounded-xl border-l-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
              style={{ borderLeftColor: flag.color === 'rose' ? '#f43f5e' : flag.color === 'amber' ? '#f59e0b' : '#3b82f6' }}>
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-full flex-shrink-0 ${flag.color === 'rose' ? 'bg-rose-50 text-rose-600' : flag.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                  <span className="material-symbols-outlined">{flag.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm mb-1">{flag.type}</p>
                  <p className="text-xs text-gray-400 mb-3 truncate">{flag.description}</p>
                  <button className="text-[11px] font-bold text-blue-800 hover:underline">
                    {flag.action}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Info */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-800 text-sm">person</span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">Logged as: {user?.email || "admin@lw-academy.com"}</p>
            <p className="text-xs text-gray-400">Last login: {new Date().toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          System Operational
        </div>
      </div>
    </div>
  );
}