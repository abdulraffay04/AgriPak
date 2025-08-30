// src/pages/UserLayout.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "./SidebarTopbar.css";

function UserLayout() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.name) {
      setUserName(user.name);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* Top bar */}
      <header className="dashboard-header">
        <h1 className="platform-name">AgriPak</h1>
        <span className="user-name">Hi, {userName}</span>
      </header>

      <div className="dashboard-body">
        {/* Sidebar */}
        <aside className="sidebar">
          <button onClick={() => navigate("/user/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/user/calculator")}>Yield Calculator</button>
          <button onClick={() => navigate("/user/rate")}>Crops Rate</button>
          <button onClick={() => navigate("/user/chat")}>Chatting</button>
          <button onClick={() => navigate("/user/blogs")}>Blogs</button>
          <button className="logout" onClick={handleLogout}>Logout</button>
        </aside>

        {/* Main content */}
        <main className="content">
          <Outlet /> {/* Here all pages will be rendered */}
        </main>
      </div>
    </div>
  );
}

export default UserLayout;
