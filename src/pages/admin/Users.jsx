// src/pages/admin/Users.jsx
import { useState, useEffect } from "react";
import { getUsers, updateUserRoles } from "../../api/adminApi";

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedStatus, setSelectedStatus] = useState("Any Status");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // État de la modale
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
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

  // === DÉFINIR LES FONCTIONS D'ABORD (avant de les utiliser) ===
  const getRoleLabel = (roles) => {
    if (!roles) return "User";
    if (roles.includes('ROLE_ADMIN')) return "Admin";
    if (roles.includes('ROLE_PROF')) return "Professor";
    if (roles.includes('ROLE_TUTEUR')) return "Tutor";
    if (roles.includes('ROLE_ETUDIANT')) return "Student";
    return "User";
  };

  const getRoleColor = (roles) => {
    if (!roles) return "bg-gray-100 text-gray-600";
    if (roles.includes('ROLE_ADMIN')) return "bg-blue-900 text-white";
    if (roles.includes('ROLE_PROF')) return "bg-blue-50 text-blue-800";
    if (roles.includes('ROLE_TUTEUR')) return "bg-amber-50 text-amber-800";
    if (roles.includes('ROLE_ETUDIANT')) return "bg-gray-100 text-gray-600";
    return "bg-gray-100 text-gray-600";
  };

  // Charger les utilisateurs depuis l'API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Transformer les données API pour le tableau
  const transformedUsers = users.map(user => ({
    id: user.id,
    name: `${user.prenom || ''} ${user.nom || ''}`.trim(),
    email: user.email,
    role: getRoleLabel(user.roles),
    roleColor: getRoleColor(user.roles),
    status: user.isVerified ? "Active" : "Pending",
    statusColor: user.isVerified ? "text-green-600" : "text-gray-500",
    statusDot: user.isVerified ? "bg-green-600" : "bg-gray-400",
    registered: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A",
    engagement: user.engagement || 0,
    engagementLabel: user.engagement ? `${user.engagement}% engagement` : "New Account",
    initials: `${(user.prenom?.charAt(0) || '')}${(user.nom?.charAt(0) || '')}`,
    hasImage: false,
    rawRoles: user.roles
  }));

  // Filtrer les utilisateurs
  const filteredUsers = transformedUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesRole = true;
    if (selectedRole !== "All Roles") {
      const roleMap = { "Students": "Student", "Professors": "Professor", "Tutors": "Tutor", "Admins": "Admin" };
      matchesRole = user.role === roleMap[selectedRole];
    }
    
    let matchesStatus = true;
    if (selectedStatus !== "Any Status") {
      matchesStatus = user.status === selectedStatus;
    }
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const toggleSelectUser = (id) => {
    setSelectedUsers(prev => 
      prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  // Gestion des rôles (édition)
  const handleEditRoles = (user) => {
    setEditingUser(user);
    alert(`Édition des rôles pour ${user.name}`);
  };

  const handleSuspendUser = async (user) => {
    if (confirm(`Voulez-vous suspendre ${user.name} ?`)) {
      try {
        console.log("Suspend user:", user.id);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleActivateUser = async (user) => {
    try {
      console.log("Activate user:", user.id);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteUser = async (user) => {
    if (confirm(`Voulez-vous supprimer définitivement ${user.name} ?`)) {
      try {
        console.log("Delete user:", user.id);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  // Stats
  const stats = {
    total: transformedUsers.length,
    professors: transformedUsers.filter(u => u.role === "Professor").length,
    tutors: transformedUsers.filter(u => u.role === "Tutor").length,
    students: transformedUsers.filter(u => u.role === "Student").length,
    admins: transformedUsers.filter(u => u.role === "Admin").length,
    pending: transformedUsers.filter(u => u.status === "Pending").length
  };

  // Gestion du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowSuccess(true);
      
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
        fetchUsers();
      }, 2000);
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    if (!isSubmitting) setShowModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-full relative">
      {/* Header */}
      <div>
        <nav className="flex items-center gap-2 mb-4 text-xs text-gray-400">
          <span className="hover:text-blue-800 cursor-pointer font-medium">Admin</span>
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
            className="bg-blue-900 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all font-semibold text-sm"
          >
            <span className="material-symbols-outlined text-lg">person_add</span>
            Create New User
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[280px] relative">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <span className="material-symbols-outlined text-lg">search</span>
          </span>
          <input 
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-200 text-sm transition-all outline-none"
            placeholder="Search by name, email or ID..." 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3 flex-wrap">
          <select 
            className="bg-gray-50 border-none rounded-lg py-3 pl-4 pr-10 text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-blue-200 cursor-pointer outline-none"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option>All Roles</option>
            <option>Students</option>
            <option>Professors</option>
            <option>Tutors</option>
            <option>Admins</option>
          </select>
          
          <select 
            className="bg-gray-50 border-none rounded-lg py-3 pl-4 pr-10 text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-blue-200 cursor-pointer outline-none"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option>Any Status</option>
            <option>Active</option>
            <option>Pending</option>
          </select>
          
          <button className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-lg">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
      </section>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-gray-100 shadow-md">
          <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Total Enrolled</span>
          <div className="text-4xl font-bold text-blue-900 mt-1 font-serif">{stats.total}</div>
        </div>

        <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-blue-50/50 p-6 rounded-xl">
            <div className="text-2xl font-bold text-gray-900">{stats.professors}</div>
            <div className="text-xs text-gray-500">Professors</div>
          </div>
          <div className="bg-blue-50/50 p-6 rounded-xl">
            <div className="text-2xl font-bold text-gray-900">{stats.tutors}</div>
            <div className="text-xs text-gray-500">Tutors</div>
          </div>
          <div className="bg-blue-50/50 p-6 rounded-xl">
            <div className="text-2xl font-bold text-gray-900">{stats.students}</div>
            <div className="text-xs text-gray-500">Students</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100">
            <div className="text-2xl font-bold text-red-600">{stats.pending}</div>
            <div className="text-xs text-gray-500">Pending Review</div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-500">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-900 w-4 h-4 cursor-pointer"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={toggleSelectAll}
                    />
                    Name
                  </div>
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Role</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Registered</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <input 
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-900 w-4 h-4 cursor-pointer"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleSelectUser(user.id)}
                      />
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 font-bold text-sm">
                        {user.initials || "U"}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{user.name}</div>
                        <div className="text-xs text-gray-400">{user.email}</div>
                      </div>
                    </div>
                   </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 text-[11px] font-bold rounded-full uppercase ${user.roleColor}`}>
                      {user.role}
                    </span>
                   </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${user.statusDot}`}></span>
                      <span className={`text-sm font-semibold ${user.statusColor}`}>{user.status}</span>
                    </div>
                   </td>
                  <td className="px-6 py-5 text-sm text-gray-600">{user.registered}</td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {user.status === "Pending" ? (
                        <button onClick={() => handleActivateUser(user)} className="p-2 hover:bg-green-50 rounded-lg text-green-600" title="Activate">
                          <span className="material-symbols-outlined text-lg">check_circle</span>
                        </button>
                      ) : (
                        <button onClick={() => handleSuspendUser(user)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400" title="Suspend">
                          <span className="material-symbols-outlined text-lg">block</span>
                        </button>
                      )}
                      <button onClick={() => handleEditRoles(user)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-800" title="Edit Roles">
                        <span className="material-symbols-outlined text-lg">edit_square</span>
                      </button>
                      <button onClick={() => handleDeleteUser(user)} className="p-2 hover:bg-red-50 rounded-lg text-red-500" title="Delete">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-5 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
          <p className="text-xs text-gray-400">
            Showing <span className="font-bold text-gray-900">1-{filteredUsers.length}</span> of <span className="font-bold text-gray-900">{transformedUsers.length}</span> users
          </p>
          <div className="flex gap-2">
            <button className="p-2 border rounded-lg hover:bg-white">
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button className="h-9 w-9 bg-blue-900 text-white rounded-lg font-bold text-xs">1</button>
            <button className="p-2 border rounded-lg hover:bg-white">
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Create User */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Créer un utilisateur</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleInputChange} className="w-full p-2 border rounded" />
              <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleInputChange} className="w-full p-2 border rounded" />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="w-full p-2 border rounded" />
              <select name="role" value={formData.role} onChange={handleInputChange} className="w-full p-2 border rounded">
                <option value="Student">Étudiant</option>
                <option value="Professor">Professeur</option>
                <option value="Tutor">Tuteur</option>
                <option value="Admin">Administrateur</option>
              </select>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded">Annuler</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-900 text-white rounded">Créer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}