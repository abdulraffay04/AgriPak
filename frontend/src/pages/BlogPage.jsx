// src/pages/BlogPage.js
import React, { useEffect, useState } from "react";
import api from "../services/api"; // adjust the path if your structure differs
import "./BlogPage.css";

function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", author: "" });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      const { data } = await api.get("/api/blogs");
      setBlogs(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Submit new blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/api/blogs", form);
      alert(data.message || "Blog submitted");

      setForm({ title: "", content: "", author: "" });
      setShowForm(false);
      fetchBlogs();
    } catch (error) {
      console.error("Error submitting blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const latestBlogs = blogs.slice(0, 3);
  const olderBlogs = blogs.slice(3);

  // Truncate content for preview
  const snippet = (text, length = 120) =>
    text.length > length ? text.substring(0, length) + "..." : text;

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Blogs</h3>

      {/* Write Blog Button */}
      <button className="btn-write mb-4" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Close Blog Form" : "✍️ Write a Blog"}
      </button>

      {/* Blog Form */}
      {showForm && (
        <div className="card p-3 mb-4 shadow-sm blog-form">
          <h5>✍️ Submit Your Blog</h5>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Your Name"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              required
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Blog Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <textarea
              className="form-control mb-2"
              placeholder="Blog Content"
              rows="4"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
            ></textarea>
            <button className="btn-submit" type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Blog"}
            </button>
          </form>
        </div>
      )}

      {/* Latest Blogs */}
      {latestBlogs.length > 0 && (
        <>
          <h4 className="section-title">Latest Blogs</h4>
          <div className="latest-blogs">
            {latestBlogs.map((blog) => (
              <div
                key={blog._id}
                className="card blog-card"
                onClick={() => setSelectedBlog(blog)}
              >
                <h5>{blog.title}</h5>
                <small className="text-muted">
                  By {blog.author} • {new Date(blog.createdAt).toLocaleDateString()}
                </small>
                <p>{snippet(blog.content)}</p>
                <span className="read-more">Read More</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Older Blogs */}
      {olderBlogs.length > 0 && (
        <>
          <h4 className="section-title mt-4">Older Blogs</h4>
          <div className="older-blogs">
            {olderBlogs.map((blog) => (
              <div
                key={blog._id}
                className="card blog-card mb-3"
                onClick={() => setSelectedBlog(blog)}
              >
                <h5>{blog.title}</h5>
                <small className="text-muted">
                  By {blog.author} • {new Date(blog.createdAt).toLocaleDateString()}
                </small>
                <p>{snippet(blog.content)}</p>
                <span className="read-more">Read More</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {selectedBlog && (
        <div className="modal-overlay" onClick={() => setSelectedBlog(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h4>{selectedBlog.title}</h4>
            <small className="text-muted">
              By {selectedBlog.author} • {new Date(selectedBlog.createdAt).toLocaleDateString()}
            </small>
            <p className="mt-2">{selectedBlog.content}</p>
            <button className="btn-close-modal" onClick={() => setSelectedBlog(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogPage;
