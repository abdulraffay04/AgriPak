import React, { useEffect, useState } from "react";
import { Table, Spin, Typography, Select } from "antd";
import api from "../services/api"; // ✅ use your central API service
import "./CropRates.css";

const { Title } = Typography;
const { Option } = Select;

const CropsRate = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommodity, setSelectedCommodity] = useState(null);

  const columns = [
    { title: "Commodity", dataIndex: "commodity", key: "commodity" },
    { title: "Product (EN)", dataIndex: "product_en", key: "product_en" },
    { title: "Product (UR)", dataIndex: "product_ur", key: "product_ur" },
    { title: "Province", dataIndex: "province", key: "province" },
    { title: "Min Price", dataIndex: "min", key: "min" },
    { title: "Max Price", dataIndex: "max", key: "max" },
    { title: "Avg Price", dataIndex: "avg", key: "avg" },
  ];

  useEffect(() => {
    api
      .get("/api/prices")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setData(res.data);
          setFiltered(res.data);
        } else {
          console.warn("Unexpected response:", res.data);
          setData([]);
          setFiltered([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching prices:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleFilterChange = (value) => {
    setSelectedCommodity(value);
    setFiltered(value ? data.filter((item) => item.commodity === value) : data);
  };

  const uniqueCommodities = [...new Set(data.map((item) => item.commodity))];

  return (
    <div className="crop-rates-container">
      <Title level={3}>All Commodity Prices</Title>

      <Select
        placeholder="Filter by Commodity"
        onChange={handleFilterChange}
        allowClear
        style={{ width: 300, marginBottom: 16 }}
        value={selectedCommodity}
      >
        {uniqueCommodities.map((commodity) => (
          <Option key={commodity} value={commodity}>
            {commodity}
          </Option>
        ))}
      </Select>

      {loading ? (
        <Spin tip="Loading..." />
      ) : (
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey={(record, index) => index}
          pagination={{ pageSize: 10 }}
          bordered
        />
      )}
    </div>
  );
};

export default CropsRate;
