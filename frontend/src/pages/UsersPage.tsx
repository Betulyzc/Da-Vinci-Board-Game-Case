import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Pencil, Trash2, FileText } from "lucide-react";
import { useToast } from "../hooks/useToast";
import Toast from "../components/Toast";
import { API_BASE } from "../lib/api"; 

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<Omit<User, "id">>({
    name: "",
    username: "",
    email: "",
  });
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const rowRefs = useRef<{ [key: number]: HTMLTableRowElement | null }>({});
  const [highlightId, setHighlightId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { toast, showToast } = useToast();

  useEffect(() => {
    fetch(`${API_BASE}/users`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        showToast("Failed to load users", "error");
      });
  }, [showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingUserId) {
        const res = await fetch(`${API_BASE}/users/${editingUserId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Update failed");

        const updated = await res.json();
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUserId ? updated : u))
        );
        setEditingUserId(null);
        showToast("User updated", "warning");
      } else {
        const res = await fetch(`${API_BASE}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Create failed");

        const newUser = await res.json();
        setUsers((prev) => [...prev, newUser]);

        setHighlightId(newUser.id);
        setTimeout(() => {
          rowRefs.current[newUser.id]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 200);
        window.setTimeout(() => setHighlightId(null), 2000);

        showToast("User added", "success");
      }
    } catch (err) {
      console.error(err);
      showToast("Error saving user", "error");
    }

    setFormData({ name: "", username: "", email: "" });
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");

      setUsers((prev) => prev.filter((u) => u.id !== id));
      showToast("User deleted", "error");
    } catch (err) {
      console.error(err);
      showToast("Error deleting user", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-200">
        <p className="animate-pulse text-lg">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-200">
        <p className="text-red-400 text-lg"> {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-200 p-8 flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <motion.h1
          className="text-4xl font-extrabold"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-[length:200%_200%] bg-clip-text text-transparent animate-shine">
            Users
          </span>
        </motion.h1>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ scale: 1 }}
          animate={{ scale: editingUserId ? 1.05 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`flex flex-col md:flex-row gap-4 items-center bg-gray-800/40 p-4 rounded-xl border ${
            editingUserId
              ? "border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.6)]"
              : "border-gray-700"
          } w-full md:w-auto`}
        >
          <input
            type="text"
            placeholder="Name"
            className="flex-1 min-w-[220px] px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Username"
            className="flex-1 min-w-[220px] px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="flex-1 min-w-[250px] px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className={`px-6 py-2 rounded-lg transition text-white font-medium shadow
                ${
                  editingUserId
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
            >
              {editingUserId ? "Update User" : "Add User"}
            </button>

            {editingUserId && (
              <button
                type="button"
                onClick={() => {
                  setEditingUserId(null);
                  setFormData({ name: "", username: "", email: "" });
                }}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-rose-400/20 to-pink-300/20 hover:from-rose-500/30 hover:to-pink-400/30 border border-rose-400/30 text-rose-200 font-medium transition"
              >
                Cancel
              </button>
            )}
          </div>
        </motion.form>
      </div>

      <motion.table
        className="border-collapse w-full shadow-xl rounded-2xl overflow-hidden bg-gray-800/40 border border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <thead>
          <tr className="bg-gray-800/70 text-gray-300">
            <th className="border border-gray-700 px-3 py-2 text-center">ID</th>
            <th className="border border-gray-700 px-3 py-2">Name</th>
            <th className="border border-gray-700 px-3 py-2">Username</th>
            <th className="border border-gray-700 px-3 py-2">Email</th>
            <th className="border border-gray-700 px-3 py-2 whitespace-nowrap">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <motion.tr
              key={user.id}
              ref={(el) => {
                rowRefs.current[user.id] = el;
              }}
              className={`hover:bg-gray-700/40 transition-colors ${
                highlightId === user.id ? "ring-2 ring-purple-500/50" : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <td className="border border-gray-700 px-3 py-2 text-center">
                {user.id}
              </td>
              <td className="border border-gray-700 px-3 py-2">{user.name}</td>
              <td className="border border-gray-700 px-3 py-2">{user.username}</td>
              <td className="border border-gray-700 px-3 py-2">{user.email}</td>
              <td className="border border-gray-700 px-2 py-2 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingUserId(user.id);
                      setFormData({
                        name: user.name,
                        username: user.username,
                        email: user.email,
                      });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="group inline-flex items-center gap-1.5 rounded-md px-2 py-1
                               bg-yellow-400/10 text-yellow-300 border border-yellow-400/20
                               hover:bg-yellow-400/15 hover:border-yellow-400/40
                               hover:shadow-[0_0_8px_rgba(250,204,21,0.25)] transition"
                  >
                    <Pencil className="w-4 h-4" />
                    <span className="text-sm">Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(user.id)}
                    className="group inline-flex items-center gap-1.5 rounded-md px-2 py-1
                               bg-rose-400/10 text-rose-300 border border-rose-400/20
                               hover:bg-rose-400/15 hover:border-rose-400/40
                               hover:shadow-[0_0_8px_rgba(244,63,94,0.25)] transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm">Delete</span>
                  </button>

                  <Link
                    to={`/users/${user.id}/posts`}
                    className="group inline-flex items-center gap-1.5 rounded-md px-2 py-1
                               bg-sky-400/10 text-sky-300 border border-sky-400/20
                               hover:bg-sky-400/15 hover:border-sky-400/40
                               hover:shadow-[0_0_8px_rgba(56,189,248,0.25)] transition"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">View Posts</span>
                  </Link>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>

      <Link
        to="/"
        className="fixed bottom-5 left-5 z-50
                  inline-block px-5 py-2 rounded-xl 
                  bg-gray-800/80 backdrop-blur-lg border border-gray-700 text-gray-200 
                  hover:bg-gray-700 hover:shadow-md hover:shadow-purple-500/20 
                  transition-all duration-300"
      >
        ⬅ Home
      </Link>

      <Toast toast={toast} />
    </div>
  );
}

export default UsersPage;
