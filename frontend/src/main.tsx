import './index.css';
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import UsersPage from "./pages/UsersPage";
import PostsPage from './pages/PostsPage';
import UserPostsPage from './pages/UserPostsPage';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/posts" element= {<PostsPage />} />
        <Route path="/users/:id/posts" element={<UserPostsPage />} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
