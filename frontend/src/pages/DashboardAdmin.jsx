import React, { useEffect, useState } from "react";
import api from "../services/api"; // ✅ use centralized API service

function DashboardAdmin() {
  const [blogs, setBlogs] = useState([]);

  // Fetch all blogs (pending + published)
  const fetchBlogs = async () => {
    try {
      const res = await api.get("/api/blogs/admin");
      setBlogs(res.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Publish Blog
  const handlePublish = async (id) => {
    try {
      await api.put(`/api/blogs/${id}/publish`);
      fetchBlogs(); // refresh list after publishing
    } catch (error) {
      console.error("Error publishing blog:", error);
    }
  };

  // Delete Blog
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await api.delete(`/api/blogs/${id}`);
      fetchBlogs(); // refresh list after deletion
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Welcome Admin</h2>
      <p>Manage submitted blogs below:</p>

      {blogs.length === 0 ? (
        <p>No blogs submitted yet.</p>
      ) : (
        blogs.map((blog) => (
          <div key={blog._id} className="card mb-3 shadow-sm p-3">
            <h5>{blog.title}</h5>
            <small className="text-muted">
              By {blog.author} •{" "}
              {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ""}
            </small>
            <p className="mt-2">{blog.content}</p>

            <div>
              {!blog.published && (
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => handlePublish(blog._id)}
                >
                  ✅ Publish
                </button>
              )}
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(blog._id)}
              >
                ❌ Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default DashboardAdmin;
