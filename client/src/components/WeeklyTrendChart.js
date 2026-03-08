import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const WeeklyTrendChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchWeeklyTrends = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(`${API_BASE}/api/stats/weekly-trending`);

        if (isMounted) {
          setData(res.data || []);
        }
      } catch (err) {
        console.error("Error fetching weekly trend data:", err);
        if (isMounted) setError("Could not load weekly trend data.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchWeeklyTrends();

    return () => {
      isMounted = false;
    };
  }, []);

  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div className="chart-wrap">
      <h4>Weekly Trending Movie Count</h4>

      {loading && <p>Loading weekly trends…</p>}
      {!loading && error && <p className="error-text">{error}</p>}
      {!loading && !error && !hasData && (
        <p>No weekly trend data available.</p>
      )}

      {!loading && !error && hasData && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default WeeklyTrendChart;
