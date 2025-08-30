import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import "./DashboardUser.css";

const data = [
  { name: "Cotton", avg: 7000, max: 7200, min: 6800 },
  { name: "Wheat", avg: 2717, max: 2807, min: 2627 },
  { name: "Maize", avg: 3100, max: 3200, min: 3000 },
  { name: "Rice", avg: 3700, max: 3850, min: 3600 },
  { name: "Edible Oil", avg: 12000, max: 12500, min: 11500 },
  { name: "Pulses", avg: 1800, max: 1900, min: 1700 },
  { name: "Spices", avg: 4000, max: 4200, min: 3800 }
];

const COLORS = ["#1abc9c", "#3498db", "#e67e22", "#9b59b6", "#f1c40f", "#2ecc71", "#e74c3c"];

function DashboardUser() {
  return (
    <div className="dashboard-user">
      <h2>Welcome to your Dashboard</h2>

      <div className="grid-container">

        {/* Line Chart */}
        <div className="graph-card">
          <h2>Commodity Price Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="avg" stroke="green" name="Avg Price" />
              <Line type="monotone" dataKey="max" stroke="blue" name="Max Price" />
              <Line type="monotone" dataKey="min" stroke="orange" name="Min Price" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="graph-card">
          <h2>Price Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avg" fill="green" name="Avg Price" />
              <Bar dataKey="max" fill="blue" name="Max Price" />
              <Bar dataKey="min" fill="orange" name="Min Price" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="graph-card">
          <h2>Market Share (Avg Prices)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="avg"
                nameKey="name"
                outerRadius={120}
                label
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Area Chart */}
        <div className="graph-card">
          <h2>Price Fluctuations</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="avg" stroke="#1abc9c" fill="#a3e4d7" />
              <Area type="monotone" dataKey="max" stroke="#3498db" fill="#d6eaf8" />
              <Area type="monotone" dataKey="min" stroke="#e67e22" fill="#f9e79f" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default DashboardUser;
