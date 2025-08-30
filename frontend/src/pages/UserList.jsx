// src/pages/UserList.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Form,
  Input,
  Select,
  message,
  Typography,
} from "antd";
import api from "../services/api";

const { Title } = Typography;
const { Option } = Select;

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/users");
      setUsers(res.data.users || res.data);
    } catch (err) {
      message.error(err.response?.data?.msg || err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      message.success("User deleted successfully");
    } catch (err) {
      message.error(err.response?.data?.msg || err.message);
    }
  };

  // Start editing
  const handleEdit = (user) => {
    setEditingUser(user._id);
    form.setFieldsValue({ name: user.name, email: user.email, role: user.role });
  };

  // Save updated user
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const res = await api.put(`/api/users/${editingUser}`, values);
      setUsers(users.map((u) => (u._id === editingUser ? res.data.user : u)));
      setEditingUser(null);
      message.success("User updated successfully");
    } catch (err) {
      message.error(err.response?.data?.msg || err.message);
    }
  };

  // Filtered data
  const filteredUsers = users.filter(
    (u) =>
      (u.name.toLowerCase().includes(searchText.toLowerCase()) ||
        u.email.toLowerCase().includes(searchText.toLowerCase())) &&
      (roleFilter ? u.role === roleFilter : true)
  );

  const columns = [
    {
      title: "#",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (_, record) =>
        editingUser === record._id ? (
          <Form.Item name="name" rules={[{ required: true, message: "Name is required" }]}>
            <Input />
          </Form.Item>
        ) : (
          record.name
        ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (_, record) =>
        editingUser === record._id ? (
          <Form.Item
            name="email"
            rules={[{ required: true, type: "email", message: "Valid email required" }]}
          >
            <Input />
          </Form.Item>
        ) : (
          record.email
        ),
    },
    {
      title: "Role",
      dataIndex: "role",
      filters: [
        { text: "User", value: "user" },
        { text: "Admin", value: "admin" },
      ],
      onFilter: (value, record) => record.role === value,
      render: (_, record) =>
        editingUser === record._id ? (
          <Form.Item name="role" rules={[{ required: true }]}>
            <Select>
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
        ) : (
          record.role
        ),
    },
    {
      title: "Actions",
      render: (_, record) =>
        editingUser === record._id ? (
          <Space>
            <Button type="primary" onClick={handleSave}>
              Save
            </Button>
            <Button onClick={() => setEditingUser(null)}>Cancel</Button>
          </Space>
        ) : (
          <Space>
            <Button onClick={() => handleEdit(record)}>Edit</Button>
            <Popconfirm
              title="Are you sure to delete this user?"
              onConfirm={() => handleDelete(record._id)}
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          </Space>
        ),
    },
  ];

  return (
    <div>
      <Title level={3}>User Management</Title>

      {/* Search & Filter */}
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search by name or email"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Select
          placeholder="Filter by role"
          allowClear
          value={roleFilter}
          onChange={(value) => setRoleFilter(value)}
          style={{ width: 160 }}
        >
          <Option value="user">User</Option>
          <Option value="admin">Admin</Option>
        </Select>
      </Space>

      {/* User Table */}
      <Form form={form} component={false}>
        <Table
          dataSource={filteredUsers}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 8 }}
          bordered
        />
      </Form>
    </div>
  );
}

export default UserList;




