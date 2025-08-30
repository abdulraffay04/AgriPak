import React, { useEffect, useState } from "react";

function DashboardAdmin() {
  const [blogs, setBlogs] = useState([]);

  // Fetch all blogs (pending + published)
  const fetchBlogs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/blogs/admin"); 
      const data = await res.json();
      setBlogs(data);
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
      await fetch(`http://localhost:5000/api/blogs/${id}/publish`, {
        method: "PUT",
      });
      fetchBlogs();
    } catch (error) {
      console.error("Error publishing blog:", error);
    }
  };

  // Delete Blog
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await fetch(`http://localhost:5000/api/blogs/${id}`, {
        method: "DELETE",
      });
      fetchBlogs();
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
              By {blog.author} • {new Date(blog.createdAt).toLocaleDateString()}
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
