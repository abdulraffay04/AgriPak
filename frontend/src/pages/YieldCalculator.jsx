import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Select,
  InputNumber,
  Button,
  Card,
  Alert,
  Table,
  Typography,
} from "antd";
import "./YieldCalculator.css";
import api from "../services/api";

const { Option } = Select;
const { Title, Text } = Typography;

const YieldCalculator = () => {
  const [province, setProvince] = useState("");
  const [crop, setCrop] = useState("");
  const [landSize, setLandSize] = useState(null);
  const [yieldPerAcre, setYieldPerAcre] = useState(0);
  const [avgRate, setAvgRate] = useState(0);
  const [expectedRevenue, setExpectedRevenue] = useState(null);
  const [costs, setCosts] = useState(null);
  const [profit, setProfit] = useState(null);
  const [error, setError] = useState("");

  // Default yields (maunds per acre, 1 maund = 40kg)
  const defaultYields = {
    Wheat: 35,
    Rice: 28,
    Maize: 40,
    Cotton: 22,
  };

  // Fetch avg rate for selected crop + province
  const fetchAverageRate = async () => {
    try {
      const res = await api.get("/api/prices");
      const filtered = res.data.filter(
        (item) =>
          item.commodity?.toLowerCase() === crop.toLowerCase() &&
          item.province?.toLowerCase() === province.toLowerCase()
      );

      if (filtered.length === 0) {
        setError("No market rate found for this crop in the selected province.");
        return;
      }

      const numericAvgs = filtered
        .map((i) => parseInt(i.avg.replace(/[^\d]/g, ""), 10))
        .filter((num) => !isNaN(num));

      if (numericAvgs.length === 0) {
        setError("Could not parse any valid average rate.");
        return;
      }

      const avg = Math.round(
        numericAvgs.reduce((a, b) => a + b, 0) / numericAvgs.length
      );

      setAvgRate(avg);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch rates from server.");
    }
  };

  useEffect(() => {
    if (province && crop) {
      fetchAverageRate();
      setYieldPerAcre(defaultYields[crop] || 0);
    }
  }, [province, crop]);

  // Handle calculation
  const handleCalculate = () => {
    if (!avgRate || !yieldPerAcre || !landSize) {
      setError("Please enter valid inputs.");
      return;
    }

    const totalYield = yieldPerAcre * parseFloat(landSize); // in maunds
    const revenue = totalYield * avgRate; // Rs.

    const costBreakdown = {
      Seed: 5000 * landSize,
      Water: 3000 * landSize,
      Fertilizer: 4000 * landSize,
      Harvesting: 2000 * landSize,
    };

    const totalCost = Object.values(costBreakdown).reduce((a, b) => a + b, 0);
    const netProfit = revenue - totalCost;

    setExpectedRevenue(revenue);
    setCosts(costBreakdown);
    setProfit(netProfit);
    setError("");
  };

  const costData = costs
    ? Object.entries(costs).map(([key, value]) => ({
        key,
        item: key,
        cost: `Rs. ${value.toLocaleString()}`,
      }))
    : [];

  const columns = [
    { title: "Item", dataIndex: "item", key: "item" },
    { title: "Cost", dataIndex: "cost", key: "cost" },
  ];

  return (
    <Card title="Yield & Profit Calculator" className="yield-calculator-card" style={{ maxWidth: 1000, margin: "20px auto" }}>
      <Form layout="vertical" onFinish={handleCalculate}>
        <Form.Item label="Province" required>
          <Select
            value={province}
            onChange={setProvince}
            placeholder="Select province"
          >
            <Option value="Punjab">Punjab</Option>
            <Option value="Sindh">Sindh</Option>
            <Option value="Balochistan">Balochistan</Option>
            <Option value="KPK">KPK</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Crop" required>
          <Select value={crop} onChange={setCrop} placeholder="Select crop">
            <Option value="Wheat">Wheat</Option>
            <Option value="Rice">Rice</Option>
            <Option value="Maize">Maize</Option>
            <Option value="Cotton">Cotton</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Land Size (acres)" required>
          <InputNumber
            value={landSize}
            onChange={setLandSize}
            min={1}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Calculate
          </Button>
        </Form.Item>
      </Form>

      {error && <Alert message={error} type="error" showIcon closable className="mb-3" />}

      {expectedRevenue && costs && (
        <div>
          <Card type="inner" title="📊 Results" style={{ marginBottom: 16 }}>
            <p>
              <Text strong>Average Rate:</Text> Rs. {avgRate} (per maund ~40kg)
            </p>
            <p>
              <Text strong>Yield per acre:</Text> {yieldPerAcre} maunds
            </p>
            <p>
              <Text strong>Total Revenue:</Text> Rs. {expectedRevenue.toLocaleString()}
            </p>
            <p>
              <Text strong>Total Cost:</Text> Rs.{" "}
              {Object.values(costs).reduce((a, b) => a + b, 0).toLocaleString()}
            </p>
            <p>
              <Text strong>Profit:</Text>{" "}
              <Text type={profit >= 0 ? "success" : "danger"}>
                Rs. {profit.toLocaleString()}
              </Text>
            </p>
          </Card>

          <Card type="inner" title="💰 Cost Breakdown">
            <Table
              dataSource={costData}
              columns={columns}
              pagination={false}
              bordered
              size="small"
            />
          </Card>
        </div>
      )}
    </Card>
  );
};

export default YieldCalculator;
