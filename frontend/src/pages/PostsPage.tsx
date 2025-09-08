import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "../hooks/useToast";
import Toast from "../components/Toast";
import { API_BASE } from "../lib/api";

interface Post {
  userId: number;
  id: number;
  title: string;
}
interface User {
  id: number;
  name: string;
}

function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<{ userId: number; title: string }>({
    userId: 1,
    title: "",
  });
  const [editingPostId, setEditingPostId] = useState<number | null>(null);

  const rowRefs = useRef<{ [key: number]: HTMLTableRowElement | null }>({});
  const { toast, showToast } = useToast();
  const [highlightId, setHighlightId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, userRes] = await Promise.all([
          fetch(`${API_BASE}/posts`),
          fetch(`${API_BASE}/users`),
        ]);

        if (!postRes.ok || !userRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [postData, userData] = await Promise.all([
          postRes.json(),
          userRes.json(),
        ]);

        setPosts(postData);
        setUsers(userData);
      } catch (err) {
        console.error(err);
        showToast("Failed to load posts", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      if (!users.some((u) => u.id === formData.userId)) {
        setFormData((prev) => ({ ...prev, userId: users[0].id }));
      }
    }
  }, [users]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (users.length === 0) {
      showToast("You must add a user first!", "error");
      return;
    }

    try {
      if (editingPostId) {
        const res = await fetch(`${API_BASE}/posts/${editingPostId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Update failed");
        const updated = await res.json();
        setPosts((prev) =>
          prev.map((p) => (p.id === editingPostId ? updated : p))
        );
        setEditingPostId(null);
        setFormData({ userId: users[0]?.id ?? 0, title: "" });
        showToast("Post updated", "warning");
      } else {
        const res = await fetch(`${API_BASE}/posts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Create failed");
        const newPost = await res.json();
        setPosts((prev) => [...prev, newPost]);

        setFormData({ userId: users[0]?.id ?? 0, title: "" });

        setHighlightId(newPost.id);
        setTimeout(() => {
          rowRefs.current[newPost.id]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 200);
        window.setTimeout(() => setHighlightId(null), 2000);

        showToast("Post added", "success");
      }
    } catch (err) {
      console.error(err);
      showToast("Error saving post", "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/posts/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setPosts((prev) => prev.filter((p) => p.id !== id));
      showToast("Post deleted", "error");
    } catch (err) {
      console.error(err);
      showToast("Error deleting post", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-200">
        <p className="animate-pulse text-lg">Loading posts...</p>
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
            Posts
          </span>
        </motion.h1>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ scale: 1 }}
          animate={{ scale: editingPostId ? 1.05 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`flex flex-col md:flex-row gap-4 items-center bg-gray-800/40 p-4 rounded-xl border ${
            editingPostId
              ? "border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.6)]"
              : "border-gray-700"
          } w-full md:w-auto`}
        >
          <select
            disabled={users.length === 0}
            className="w-56 px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 disabled:opacity-50"
            value={formData.userId}
            onChange={(e) =>
              setFormData({ ...formData, userId: Number(e.target.value) })
            }
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Post title"
            className="flex-1 min-w-[300px] px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={users.length === 0}
              className={`px-6 py-2 rounded-lg transition text-white font-medium shadow
                ${
                  users.length === 0
                    ? "bg-gray-600 cursor-not-allowed"
                    : editingPostId
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
            >
              {editingPostId ? "Update" : "Add"}
            </button>

            {editingPostId && (
              <button
                type="button"
                onClick={() => {
                  setEditingPostId(null);
                  setFormData({ userId: users[0]?.id ?? 0, title: "" });
                }}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-rose-400/20 to-pink-300/20 hover:from-rose-500/30 hover:to-pink-400/30 border border-rose-400/30 text-rose-200 font-medium transition"
              >
                Cancel
              </button>
            )}
          </div>
        </motion.form>
      </div>

      {/* Toast Component */}
      <Toast toast={toast} />

      <motion.table
        className="table-auto border-collapse w-full shadow-xl rounded-2xl overflow-hidden bg-gray-800/40 border border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <thead>
          <tr className="bg-gray-800/70 text-gray-300">
            <th className="border border-gray-700 px-4 py-2 text-center">
              Post ID
            </th>
            <th className="border border-gray-700 px-4 py-2">User</th>
            <th className="border border-gray-700 px-4 py-2">Title</th>
            <th className="border border-gray-700 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => {
            const user = users.find((u) => u.id === post.userId);
            return (
              <motion.tr
                key={post.id}
                ref={(el) => {
                  rowRefs.current[post.id] = el;
                }}
                className={`hover:bg-gray-700/40 transition-colors ${
                  highlightId === post.id ? "ring-2 ring-purple-500/50" : ""
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
              >
                <td className="border border-gray-700 px-4 py-2 text-center">
                  {post.id}
                </td>
                <td className="border border-gray-700 px-4 py-2">
                  {user ? user.name : `User ${post.userId}`}
                </td>
                <td className="border border-gray-700 px-4 py-2">{post.title}</td>
                <td className="border border-gray-700 px-4 py-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingPostId(post.id);
                        setFormData({ userId: post.userId, title: post.title });
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="group inline-flex items-center gap-1.5 rounded-md px-2.5 py-1
                                 bg-yellow-400/10 text-yellow-300 border border-yellow-400/20
                                 hover:bg-yellow-400/15 hover:border-yellow-400/40
                                 hover:shadow-[0_0_8px_rgba(250,204,21,0.25)] transition"
                    >
                      <Pencil className="w-4 h-4" />
                      <span className="text-sm">Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(post.id)}
                      className="group inline-flex items-center gap-1.5 rounded-md px-2.5 py-1
                                 bg-rose-400/10 text-rose-300 border border-rose-400/20
                                 hover:bg-rose-400/15 hover:border-rose-400/40
                                 hover:shadow-[0_0_8px_rgba(244,63,94,0.25)] transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">Delete</span>
                    </button>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </motion.table>

      <div className="mt-8">
        <Link
          to="/"
          className="fixed bottom-5 left-5 z-50
                    inline-block px-5 py-2 rounded-xl
                    bg-gray-800/80 backdrop-blur-lg border border-gray-700
                    text-gray-200 hover:bg-gray-700 
                    hover:shadow-md hover:shadow-purple-500/20 
                    transition-all duration-300"
        >
          ⬅ Home
        </Link>
      </div>
    </div>
  );
}

export default PostsPage;
