/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { BaseURL } from "../constants/data";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  Link as LinkIcon,
  Clock,
  Share2,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  MoreVertical,
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // --- API CALLS (Same as before) ---
  const fetchStats = async () => {
    try {
      const res = await axios.get(`${BaseURL}/admin/stats`, { withCredentials: true });
      setStats(res.data.stats);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BaseURL}/admin/users?page=${page}&search=${search}`, {
        withCredentials: true,
      });
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(), 500);
    return () => clearTimeout(timer);
  }, [search, page, fetchUsers]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleDelete = async (userId) => {
    if (!confirm("Delete this user?")) return;
    setActionLoading(userId);
    try {
      await axios.delete(`${BaseURL}/admin/user/${userId}`, { withCredentials: true });
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen  text-gray-100 font-sans pb-10">
      {/* Responsive Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-64 md:w-96 h-64 md:h-96 bg-primary/20 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-[-10%] right-[-10%] w-64 md:w-96 h-64 md:h-96 bg-secondary/20 rounded-full blur-3xl opacity-20" />
      </div>

      <motion.div
        className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <div className="hidden md:block px-4 py-2 bg-gray-900/50 rounded-full border border-gray-800 text-xs text-gray-400">
            {new Date().toLocaleDateString()}
          </div>
        </header>

        {/* Stats Grid - Responsive Columns: 2 on mobile, 5 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers}
            icon={<Users size={18} />}
            color="text-blue-400"
          />
          <StatCard
            title="New (7d)"
            value={stats?.newUsersCount}
            icon={<UserPlus size={18} />}
            color="text-green-400"
          />
          <StatCard
            title="Connections"
            value={stats?.totalConnections}
            icon={<LinkIcon size={18} />}
            color="text-purple-400"
          />
          <StatCard
            title="Pending"
            value={stats?.totalRequestsPending}
            icon={<Clock size={18} />}
            color="text-orange-400"
          />
          {/* Last card spans 2 columns on mobile to fill the gap */}
          <div className="col-span-2 lg:col-span-1">
            <StatCard
              title="Referrals"
              value={stats?.totalReferrals}
              icon={<Share2 size={18} />}
              color="text-pink-400"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800/25  border border-white/5 rounded-2xl shadow-xl overflow-hidden">
          {/* Toolbar - Stacks on mobile */}
          <div className="p-4 md:p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-semibold text-white">Users Directory</h2>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700 focus:border-primary/50 outline-none transition-all placeholder:text-gray-600 text-sm"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {/* LOADING STATE */}
          {loading && (
            <div className="py-20 text-center flex flex-col items-center gap-3 text-gray-500">
              <Loader2 className="animate-spin" size={32} />
              <span className="text-sm">Loading data...</span>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && users.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center gap-3 text-gray-500">
              <AlertCircle size={32} />
              <span className="text-sm">No users found.</span>
            </div>
          )}

          {!loading && users.length > 0 && (
            <>
              {/* --- DESKTOP VIEW: Table (Hidden on small screens) --- */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-800/25 text-xs uppercase tracking-wider text-gray-400 font-medium">
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Affiliation</th>
                      <th className="px-6 py-4">Joined</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    <AnimatePresence>
                      {users.map((u) => (
                        <DesktopRow key={u._id} u={u} onDelete={handleDelete} loadingId={actionLoading} />
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* --- MOBILE VIEW: Cards (Hidden on desktop) --- */}
              <div className="md:hidden grid grid-cols-1 gap-4 p-4">
                <AnimatePresence>
                  {users.map((u) => (
                    <MobileCard key={u._id} u={u} onDelete={handleDelete} loadingId={actionLoading} />
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}

          {/* Pagination */}
          <div className="p-4 border-t border-white/5 flex items-center justify-between bg-gray-800/25">
            <span className="text-xs text-gray-500">
              {page} / {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-lg bg-gray-800 border border-gray-700 disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={page === totalPages || loading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 rounded-lg bg-gray-800 border border-gray-700 disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- SUB COMPONENTS ---

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-gray-900/60 backdrop-blur-md border border-white/5 p-4 rounded-xl flex flex-col justify-between h-full">
    <div className="flex justify-between items-start mb-2">
      <p className="text-xs font-medium text-gray-400">{title}</p>
      <div className={`p-1.5 rounded-md bg-gray-800/50 ${color} bg-opacity-10`}>{icon}</div>
    </div>
    <h3 className="text-xl md:text-2xl font-bold text-white">{value ?? "-"}</h3>
  </div>
);

const UserBadge = ({ type }) => {
  const styles = {
    admin: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    student: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    recruiter: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    default: "bg-gray-700/30 text-gray-400 border-gray-600/30",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-md text-[10px] md:text-xs font-medium border ${
        styles[type?.toLowerCase()] || styles.default
      } capitalize`}
    >
      {type || "User"}
    </span>
  );
};

const Avatar = ({ user, size = "md" }) => {
  const s = size === "lg" ? "w-12 h-12 text-lg" : "w-9 h-9 text-sm";
  return (
    <div
      className={`${s} rounded-full bg-gray-800 border border-gray-700 overflow-hidden shrink-0 flex items-center justify-center text-gray-500 font-bold`}
    >
      {user.imageURL ? (
        <img src={user.imageURL} className="w-full h-full object-cover" />
      ) : (
        user.firstName?.[0]
      )}
    </div>
  );
};

// Desktop Table Row
const DesktopRow = ({ u, onDelete, loadingId }) => (
  <motion.tr
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="hover:bg-white/[0.02] transition-colors group"
  >
    <td className="px-6 py-4 flex items-center gap-3">
      <Avatar user={u} />
      <div>
        <p className="font-medium text-gray-200 text-sm">
          {u.firstName} {u.lastName}
        </p>
        <p className="text-xs text-gray-500">{u.email}</p>
      </div>
    </td>
    <td className="px-6 py-4">
      <UserBadge type={u.userType} />
    </td>
    <td className="px-6 py-4 text-gray-400 text-sm truncate max-w-[150px]">
      {u.company || u.college || "-"}
    </td>
    <td className="px-6 py-4 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
    <td className="px-6 py-4 text-right">
      <button
        onClick={() => onDelete(u._id)}
        disabled={loadingId === u._id}
        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
      >
        {loadingId === u._id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
      </button>
    </td>
  </motion.tr>
);

// Mobile Card Component
const MobileCard = ({ u, onDelete, loadingId }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 flex flex-col gap-3"
  >
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-3">
        <Avatar user={u} size="lg" />
        <div>
          <h4 className="font-semibold text-gray-200">
            {u.firstName} {u.lastName}
          </h4>
          <p className="text-xs text-gray-500">{u.email}</p>
        </div>
      </div>
      <UserBadge type={u.userType} />
    </div>

    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mt-2 bg-gray-900/30 p-2 rounded-lg">
      <div>
        <span className="block text-gray-600 mb-1">Affiliation</span>
        <span className="text-gray-300 truncate block">{u.company || u.college || "N/A"}</span>
      </div>
      <div>
        <span className="block text-gray-600 mb-1">Joined</span>
        <span className="text-gray-300">{new Date(u.createdAt).toLocaleDateString()}</span>
      </div>
    </div>

    <button
      onClick={() => onDelete(u._id)}
      disabled={loadingId === u._id}
      className="mt-1 w-full py-2 flex items-center justify-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-sm transition-all"
    >
      {loadingId === u._id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
      <span>Remove User</span>
    </button>
  </motion.div>
);

export default AdminDashboard;
