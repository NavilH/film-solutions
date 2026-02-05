import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const WeeklyTrendChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/api/stats/weekly-trending")
      .then(res => setData(res.data))
      .catch(err => console.error("Error fetching weekly trend data:", err));
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>📈 Weekly Trending Movie Count</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyTrendChart;
