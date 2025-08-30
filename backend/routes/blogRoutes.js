const express = require("express");
const Blog = require("../models/blogModel");

const router = express.Router();

// User submits blog
router.post("/", async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const blog = new Blog({ title, content, author, published: false });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error creating blog", error });
  }
});

// Public blogs (only published)
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs" });
  }
});

// Admin: all blogs (pending + published)
router.get("/admin", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin blogs" });
  }
});

// Publish a blog
router.put("/:id/publish", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.published = true;
    await blog.save();
    res.json({ message: "Blog published successfully", blog });
  } catch (error) {
    res.status(500).json({ message: "Error publishing blog" });
  }
});

// Delete a blog
router.delete("/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog" });
  }
});

module.exports = router;
