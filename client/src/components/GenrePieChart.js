import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#d84f4f", "#82ca9d", "#a832a8"];

const GenrePieChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/api/stats/genre-distribution")
      .then(res => setData(res.data))
      .catch(err => console.error("Error fetching genre distribution:", err));
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>🥧 Genre Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie dataKey="count" data={data} nameKey="genre" cx="50%" cy="50%" outerRadius={100} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GenrePieChart;
