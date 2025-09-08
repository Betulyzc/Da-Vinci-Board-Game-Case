import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
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

function UserPostsPage() {
  const { id } = useParams<{ id: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [highlightId, setHighlightId] = useState<number | null>(null);

  const rowRefs = useRef<{ [key: number]: HTMLTableRowElement | null }>({});
  const { toast, showToast } = useToast();

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [postRes, userRes] = await Promise.all([
          fetch(`${API_BASE}/users/${id}/posts`),
          fetch(`${API_BASE}/users/${id}`),
        ]);

        if (!postRes.ok || !userRes.ok) {
          throw new Error("Failed to fetch user or posts");
        }

        const [postData, userData] = await Promise.all([
          postRes.json(),
          userRes.json(),
        ]);

        setPosts(postData);
        setUser(userData);
      } catch (err) {
        console.error(err);
        showToast("Failed to load user posts", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, showToast]);

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      const res = await fetch(`${API_BASE}/users/${id}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          userId: Number(id), 
        }),
      });

      if (!res.ok) throw new Error("Failed to add post");

      const newPost = await res.json();
      setPosts((prev) => [...prev, newPost]);
      setNewTitle("");

      // scroll + highlight
      setTimeout(() => {
        rowRefs.current[newPost.id]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 200);

      setHighlightId(newPost.id);
      setTimeout(() => setHighlightId(null), 2000);

      showToast("Post added", "success");
    } catch (err) {
      console.error(err);
      showToast("Error adding post", "error");
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
      <motion.h1
        className="text-3xl font-extrabold text-center mb-10"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Posts of {user ? user.name : `User ${id}`}
      </motion.h1>

      <form
        onSubmit={handleAddPost}
        className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-gray-800/40 p-4 rounded-xl border border-gray-700"
      >
        <input
          type="text"
          placeholder="New post title"
          className="flex-1 px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
        />
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition"
        >
          Add
        </button>
      </form>

      <motion.table
        className="table-auto border-collapse w-full shadow-xl rounded-2xl overflow-hidden bg-gray-800/40 border border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <thead>
          <tr className="bg-gray-800/70 text-gray-300">
            <th className="border border-gray-700 px-4 py-2 text-center">Post ID</th>
            <th className="border border-gray-700 px-4 py-2">Title</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
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
              transition={{ delay: index * 0.05 }}
            >
              <td className="border border-gray-700 px-4 py-2 text-center">
                {post.id}
              </td>
              <td className="border border-gray-700 px-4 py-2">{post.title}</td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>

      <Link
        to="/users"
        className="fixed bottom-5 left-5 z-50
                   inline-block px-5 py-2 rounded-xl 
                   bg-gray-800/80 backdrop-blur-lg border border-gray-700 text-gray-200 
                   hover:bg-gray-700 hover:shadow-md hover:shadow-purple-500/20 
                   transition-all duration-300"
      >
        ⬅ Back to Users
      </Link>

      <Toast toast={toast} />
    </div>
  );
}

export default UserPostsPage;
