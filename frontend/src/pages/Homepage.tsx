import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Users, FileText } from "lucide-react";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, 
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease:[0.22, 1, 0.36, 1], // ease-Out 
    },
  },
};

function Homepage() {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 p-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Başlık */}
      <motion.h1
        className="relative text-5xl md:text-6xl font-extrabold tracking-tight text-center"
        variants={item}
      >
        <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 
                         bg-[length:200%_200%] bg-clip-text text-transparent 
                         animate-shine">
          Da Vinci Board Game Case
        </span>
      </motion.h1>

      {/* Açıklama */}
      <motion.p
        className="mt-8 mb-12 text-lg md:text-xl text-white max-w-2xl mx-auto text-center"
        variants={item}
      >
        Explore users and posts with a modern interface powered by React,
        TypeScript and TailwindCSS v4.
      </motion.p>

      {/* Kartlar */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full"
        variants={container}
      >
        <motion.div variants={item}>
          <Link
            to="/users"
            className="block rounded-2xl bg-gray-800/50 backdrop-blur-lg border border-gray-700 p-8 shadow-lg 
                       hover:shadow-purple-500/30 hover:-translate-y-2 transition-all duration-500"
          >
            <Users className="w-12 h-12 text-purple-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Users</h2>
            <p className="text-gray-400">
              Discover all users and their details with interactive animations.
            </p>
          </Link>
        </motion.div>

        <motion.div variants={item}>
          <Link
            to="/posts"
            className="block rounded-2xl bg-gray-800/50 backdrop-blur-lg border border-gray-700 p-8 shadow-lg 
                       hover:shadow-blue-500/30 hover:-translate-y-2 transition-all duration-500"
          >
            <FileText className="w-12 h-12 text-blue-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Posts</h2>
            <p className="text-gray-400">
              Browse posts and enjoy smooth, modern UI transitions.
            </p>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Homepage;
