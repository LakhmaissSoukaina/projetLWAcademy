import { useState } from "react";

function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedStatus, setSelectedStatus] = useState("Any Status");
  const [selectedUsers, setSelectedUsers] = useState([]);
  
  // État de la modale
  const [showModal, setShowModal] = useState(false);
  
  // État du formulaire
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    role: "Student",
    status: "Active",
    specialisation: "",
    telephone: "",
    bio: ""
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const users = [
    {
      id: 1,
      name: "Dr. Helene Beaufort",
      email: "h.beaufort@lw-academy.edu",
      role: "Professor",
      roleColor: "bg-blue-50 text-blue-800",
      status: "Active",
      statusColor: "text-green-600",
      statusDot: "bg-green-600",
      registered: "Oct 12, 2023",
      engagement: 85,
      engagementLabel: "85% engagement",
      avatar: "https://lh3.googleusercontent.com/aida/ADBb0ugN82B1x3CmEb_bs037GZqR9bkWVTkox0p4MnGP6223WAP1uoWvI_thYgvmS2Ik9RGj96qwECtPC_PQ4dKBKKof9hxMXTyO4v6rMp0qseA7chO7lWbitOuD3BEK8hoVxADTivkGSFQWYIwTbtK10R4O2LslgYXm_TKBTJ9H1GNkfyNcEPe5Ensrd0oHzl9h1YJdJvbyF_ctQ995iT0pKJVGXxZo3NSAJa8twx1hEHJdPexAZ_MMZCQQMj7p9AI-DjpuhzU6oU2K8w",
      hasImage: true
    },
    {
      id: 2,
      name: "Ahmed Mansour",
      email: "a.mansour@student.lw.edu",
      role: "Student",
      roleColor: "bg-gray-100 text-gray-600",
      status: "Active",
      statusColor: "text-green-600",
      statusDot: "bg-green-600",
      registered: "Jan 05, 2024",
      engagement: 42,
      engagementLabel: "42% engagement",
      initials: "AM",
      hasImage: false
    },
    {
      id: 3,
      name: "Marie Lefebvre",
      email: "m.lefebvre@tutor.lw.edu",
      role: "Tutor",
      roleColor: "bg-amber-50 text-amber-800",
      status: "Pending",
      statusColor: "text-gray-500",
      statusDot: "bg-gray-400",
      registered: "Feb 18, 2024",
      engagement: 0,
      engagementLabel: "New Account",
      avatar: "https://lh3.googleusercontent.com/aida/ADBb0uh-gORIA9_i2XBTfcBGNH7GvGK61nvpvmamftY8UYejNeuJ-2gn1laSL1vEXhF7sdvLuNjY6Ao8oUTl9IRE6MhxfYT2pJH4XYXbSfGEsrOug-CNxULYOog7_nWuCzv64tq-a6oa4MgiBYoPMBgiwf2DlOau_PG8OJajScH80sbddx4qabkfJEDRk2dHvVy5ZE20y7duE3gTvaK9WrkaJUfQwjkusg1lP4OD2T-LWZjynbzUqBPF8VoDkQ5CmN3iGB6gv7Vt-3sIyA",
      hasImage: true
    },
    {
      id: 4,
      name: "Jean-Claude Van Damme",
      email: "admin.jc@lw-academy.edu",
      role: "Admin",
      roleColor: "bg-blue-900 text-white",
      status: "Active",
      statusColor: "text-green-600",
      statusDot: "bg-green-600",
      registered: "Nov 22, 2022",
      engagement: 98,
      engagementLabel: "System Superuser",
      initials: "JC",
      hasImage: false
    },
    {
      id: 5,
      name: "Sophie Dubois",
      email: "s.dubois@lw-academy.edu",
      role: "Professor",
      roleColor: "bg-blue-50 text-blue-800",
      status: "Active",
      statusColor: "text-green-600",
      statusDot: "bg-green-600",
      registered: "Mar 15, 2023",
      engagement: 72,
      engagementLabel: "72% engagement",
      initials: "SD",
      hasImage: false
    },
    {
      id: 6,
      name: "Karim Benali",
      email: "k.benali@student.lw.edu",
      role: "Student",
      roleColor: "bg-gray-100 text-gray-600",
      status: "Suspended",
      statusColor: "text-red-600",
      statusDot: "bg-red-500",
      registered: "Dec 01, 2023",
      engagement: 15,
      engagementLabel: "15% engagement",
      initials: "KB",
      hasImage: false
    }
  ];

  const toggleSelectUser = (id) => {
    setSelectedUsers(prev => 
      prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(u => u.id));
    }
  };

  const getRoleStyle = (role) => {
    const styles = {
      Professor: "bg-blue-50 text-blue-800",
      Student: "bg-gray-100 text-gray-600",
      Tutor: "bg-amber-50 text-amber-800",
      Admin: "bg-blue-900 text-white"
    };
    return styles[role] || "bg-gray-100 text-gray-600";
  };

  const getStatusStyle = (status) => {
    const styles = {
      Active: { dot: "bg-green-600", text: "text-green-600" },
      Pending: { dot: "bg-gray-400", text: "text-gray-500" },
      Suspended: { dot: "bg-red-500", text: "text-red-600" }
    };
    return styles[status] || { dot: "bg-gray-400", text: "text-gray-500" };
  };

  // Gestion du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.prenom.trim()) errors.prenom = "First name is required";
    if (!formData.nom.trim()) errors.nom = "Last name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.role) errors.role = "Role is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    
    // Simulation d'appel API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Reset après succès
    setTimeout(() => {
      setShowSuccess(false);
      setShowModal(false);
      setFormData({
        prenom: "",
        nom: "",
        email: "",
        role: "Student",
        status: "Active",
        specialisation: "",
        telephone: "",
        bio: ""
      });
    }, 2000);
  };

  const closeModal = () => {
    if (!isSubmitting) {
      setShowModal(false);
      setFormErrors({});
      setFormData({
        prenom: "",
        nom: "",
        email: "",
        role: "Student",
        status: "Active",
        specialisation: "",
        telephone: "",
        bio: ""
      });
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full relative">
      {/* Breadcrumb & Header */}
      <div>
        <nav className="flex items-center gap-2 mb-4 text-xs text-gray-400">
          <span className="hover:text-blue-800 transition-colors cursor-pointer font-medium">Admin</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-blue-900 font-bold">Users</span>
        </nav>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 font-serif">User Management</h2>
            <p className="text-base text-gray-500 mt-2 max-w-xl">
              Manage permissions, monitor activity, and configure accounts across the academy.
            </p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-900 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all font-semibold text-sm flex-shrink-0"
          >
            <span className="material-symbols-outlined text-lg">person_add</span>
            Create New User
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <section className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.05)] border border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[280px] relative">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <span className="material-symbols-outlined text-lg">search</span>
          </span>
          <input 
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-200 text-sm transition-all outline-none placeholder-gray-400"
            placeholder="Search by name, email or ID..." 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <select 
              className="appearance-none bg-gray-50 border-none rounded-lg py-3 pl-4 pr-10 text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer outline-none"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option>All Roles</option>
              <option>Students</option>
              <option>Professors</option>
              <option>Tutors</option>
              <option>Admins</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none material-symbols-outlined text-gray-400 text-sm">expand_more</span>
          </div>
          
          <div className="relative">
            <select 
              className="appearance-none bg-gray-50 border-none rounded-lg py-3 pl-4 pr-10 text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer outline-none"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option>Any Status</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Suspended</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none material-symbols-outlined text-gray-400 text-sm">expand_more</span>
          </div>
          
          <div className="relative">
            <button className="flex items-center gap-2 bg-gray-50 text-sm font-semibold px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
              <span className="material-symbols-outlined text-base">calendar_today</span>
              Date Range
            </button>
          </div>
          
          <button className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
      </section>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-gray-100 shadow-[0_4px_20px_rgba(30,64,175,0.05)] flex flex-col justify-center">
          <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Total Enrolled</span>
          <div className="text-4xl font-bold text-blue-900 mt-1 font-serif">12,482</div>
          <div className="flex items-center gap-1 text-green-600 mt-2 text-xs font-semibold">
            <span className="material-symbols-outlined text-base">arrow_upward</span>
            <span>12% from last term</span>
          </div>
        </div>

        <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100/20 flex items-start justify-between">
            <div>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Academic Staff</span>
              <div className="text-2xl font-bold text-gray-900 mt-1 font-serif">458</div>
            </div>
            <div className="bg-white p-2 rounded-lg shadow-sm text-blue-900">
              <span className="material-symbols-outlined">badge</span>
            </div>
          </div>
          
          <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100/20 flex items-start justify-between">
            <div>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Active Sessions</span>
              <div className="text-2xl font-bold text-gray-900 mt-1 font-serif">1,204</div>
            </div>
            <div className="bg-white p-2 rounded-lg shadow-sm text-blue-900">
              <span className="material-symbols-outlined">bolt</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_4px_20px_rgba(30,64,175,0.05)] flex items-start justify-between">
            <div>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Pending Review</span>
              <div className="text-2xl font-bold text-red-600 mt-1 font-serif">24</div>
            </div>
            <div className="bg-red-50 p-2 rounded-lg text-red-600">
              <span className="material-symbols-outlined">warning</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.05)] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-sm font-semibold text-gray-500">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-900 focus:ring-blue-900 w-4 h-4 cursor-pointer"
                      checked={selectedUsers.length === users.length && users.length > 0}
                      onChange={toggleSelectAll}
                    />
                    Name
                  </div>
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Role</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Registered</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Activity</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => {
                const statusStyle = getStatusStyle(user.status);
                const isSelected = selectedUsers.includes(user.id);
                
                return (
                  <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <input 
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-900 focus:ring-blue-900 w-4 h-4 cursor-pointer"
                          checked={isSelected}
                          onChange={() => toggleSelectUser(user.id)}
                        />
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                          {user.hasImage ? (
                            <img alt={user.name} className="h-full w-full object-cover" src={user.avatar}/>
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-900 font-serif font-black text-sm">
                              {user.initials}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-900 text-sm truncate">{user.name}</div>
                          <div className="text-xs text-gray-400 truncate">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider ${getRoleStyle(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${statusStyle.dot}`}></span>
                        <span className={`text-sm font-semibold ${statusStyle.text}`}>{user.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600">{user.registered}</td>
                    <td className="px-6 py-5">
                      <div className="w-32 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-900 h-full rounded-full transition-all duration-500" style={{ width: `${user.engagement}%` }}></div>
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1.5 uppercase font-bold tracking-wider">{user.engagementLabel}</div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {user.status === "Pending" ? (
                          <button className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition-colors" title="Activate Account">
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                          </button>
                        ) : (
                          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors" title="Suspend Account">
                            <span className="material-symbols-outlined text-lg">block</span>
                          </button>
                        )}
                        <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-800 transition-colors" title="Edit Permissions">
                          <span className="material-symbols-outlined text-lg">edit_square</span>
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors" title="Delete User">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-5 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            Showing <span className="font-bold text-gray-900">1-{users.length}</span> of <span className="font-bold text-gray-900">12,482</span> users
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-white transition-colors text-gray-400 hover:text-gray-600">
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button className="h-9 w-9 bg-blue-900 text-white rounded-lg font-bold text-xs shadow-sm">1</button>
            <button className="h-9 w-9 hover:bg-white rounded-lg font-bold text-xs text-gray-500 transition-colors">2</button>
            <button className="h-9 w-9 hover:bg-white rounded-lg font-bold text-xs text-gray-500 transition-colors">3</button>
            <span className="px-2 text-gray-400 text-xs">...</span>
            <button className="h-9 w-9 hover:bg-white rounded-lg font-bold text-xs text-gray-500 transition-colors">156</button>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-white transition-colors text-gray-400 hover:text-gray-600">
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <footer className="pt-8 border-t border-gray-100 text-center pb-4">
        <p className="text-xs text-gray-400">
          Security Notice: All admin actions are logged and audited. 
          <a className="text-blue-900 hover:underline ml-1 font-semibold" href="#">View Audit Log</a>
        </p>
      </footer>

      {/* ==================== MODALE CREATE USER ==================== */}
      {showModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-blue-900/40 backdrop-blur-sm z-50 transition-opacity"
            onClick={closeModal}
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
              
              {/* Header */}
              <div className="sticky top-0 bg-white px-8 py-6 border-b border-gray-100 flex justify-between items-center z-10">
                <div>
                  <h2 className="text-2xl font-bold text-blue-900 font-serif">Create New User</h2>
                  <p className="text-sm text-gray-400 mt-1">Fill in the details to register a new academy member</p>
                </div>
                <button 
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>

              {/* Success Message */}
              {showSuccess && (
                <div className="mx-8 mt-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2">
                  <div className="p-2 bg-green-100 rounded-full text-green-600">
                    <span className="material-symbols-outlined">check_circle</span>
                  </div>
                  <div>
                    <p className="font-semibold text-green-800 text-sm">User Created Successfully!</p>
                    <p className="text-xs text-green-600">The account has been registered and an email sent.</p>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                
                {/* Section: Identity */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">badge</span>
                    Identity
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleInputChange}
                        placeholder="e.g. Jean"
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm transition-all outline-none focus:bg-white focus:ring-2 ${
                          formErrors.prenom 
                            ? "border-red-300 focus:ring-red-200" 
                            : "border-gray-200 focus:ring-blue-200 focus:border-blue-300"
                        }`}
                      />
                      {formErrors.prenom && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">error</span>
                          {formErrors.prenom}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        placeholder="e.g. Dupont"
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm transition-all outline-none focus:bg-white focus:ring-2 ${
                          formErrors.nom 
                            ? "border-red-300 focus:ring-red-200" 
                            : "border-gray-200 focus:ring-blue-200 focus:border-blue-300"
                        }`}
                      />
                      {formErrors.nom && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">error</span>
                          {formErrors.nom}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-lg">mail</span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="name@lw-academy.edu"
                        className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl text-sm transition-all outline-none focus:bg-white focus:ring-2 ${
                          formErrors.email 
                            ? "border-red-300 focus:ring-red-200" 
                            : "border-gray-200 focus:ring-blue-200 focus:border-blue-300"
                        }`}
                      />
                    </div>
                    {formErrors.email && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">error</span>
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Section: Role & Status */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                    Role & Permissions
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Role <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-300 appearance-none cursor-pointer"
                        >
                          <option value="Student">Student</option>
                          <option value="Professor">Professor</option>
                          <option value="Tutor">Tutor</option>
                          <option value="Admin">Administrator</option>
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 pointer-events-none">expand_more</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Initial Status
                      </label>
                      <div className="relative">
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-300 appearance-none cursor-pointer"
                        >
                          <option value="Active">Active</option>
                          <option value="Pending">Pending Review</option>
                          <option value="Suspended">Suspended</option>
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 pointer-events-none">expand_more</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Additional Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">info</span>
                    Additional Information
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Specialization
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-lg">school</span>
                        <input
                          type="text"
                          name="specialisation"
                          value={formData.specialisation}
                          onChange={handleInputChange}
                          placeholder="e.g. Mathematics, Physics..."
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-lg">phone</span>
                        <input
                          type="tel"
                          name="telephone"
                          value={formData.telephone}
                          onChange={handleInputChange}
                          placeholder="+33 6 12 34 56 78"
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bio / Description
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Brief description of the user's background and expertise..."
                      rows="3"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-300 resize-none"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <input 
                      type="checkbox" 
                      id="sendEmail"
                      className="rounded border-gray-300 text-blue-900 focus:ring-blue-900 w-4 h-4 cursor-pointer"
                      defaultChecked
                    />
                    <label htmlFor="sendEmail" className="text-sm text-gray-600 cursor-pointer select-none">
                      Send welcome email with temporary password
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isSubmitting}
                    className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-blue-900 text-white rounded-xl font-semibold text-sm hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-70 flex items-center justify-center gap-2 min-w-[160px]"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-lg">person_add</span>
                        Create User
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Users;