// src/pages/AdminLayout.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "./SidebarTopbar.css";

function AdminLayout() {
  const navigate = useNavigate();
    const [adminName, setAdminName] = useState("");
  
    useEffect(() => {
      // Try fetching admin data from localStorage
      const admin = JSON.parse(localStorage.getItem("admin")) 
                 || JSON.parse(localStorage.getItem("user")); // fallback
  
      if (admin && admin.name) {
        setAdminName(admin.name);
      } else {
        navigate("/"); // redirect if not logged in
      }
    }, [navigate]);
  
    const handleLogout = () => {
      localStorage.removeItem("admin");
      localStorage.removeItem("user");   // clear both just in case
      localStorage.removeItem("token");
      navigate("/");
    };

  return (
    <div className="dashboard-container">
      {/* Top bar */}
      <header className="dashboard-header">
        <h1 className="platform-name">AgriPak</h1>
        <span className="user-name">Hi, {adminName}</span>
      </header>

      <div className="dashboard-body">
        {/* Sidebar */}
        <aside className="sidebar">
            <button onClick={() => navigate("/admin/users")}>User List</button>
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

export default AdminLayout;
