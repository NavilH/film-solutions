import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { API_BASE } from "../config";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#d84f4f",
  "#82ca9d",
  "#a832a8"
];

const GenrePieChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchGenreDistribution = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(`${API_BASE}/api/stats/genre-distribution`);

        if (isMounted) setData(res.data || []);
      } catch (err) {
        console.error("Error fetching genre distribution:", err);
        if (isMounted) setError("Could not load genre distribution.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchGenreDistribution();

    return () => {
      isMounted = false;
    };
  }, []);

  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div className="chart-wrap">
      <h4>Genre Distribution</h4>

      {loading && <p>Loading genre breakdown…</p>}
      {!loading && error && <p className="error-text">{error}</p>}
      {!loading && !error && !hasData && <p>No genre data available.</p>}

      {!loading && !error && hasData && (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="genre"
              cx="50%"
              cy="50%"
              outerRadius={105}
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${entry.genre || index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default GenrePieChart;
