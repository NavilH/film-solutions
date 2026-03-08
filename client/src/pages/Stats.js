import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";
import WeeklyTrendChart from "../components/WeeklyTrendChart";
import GenrePieChart from "../components/GenrePieChart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const Stats = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchTrendingCounts = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(`${API_BASE}/api/stats/trending-count`);

        if (isMounted) {
          setData(res.data || []);
        }
      } catch (err) {
        console.error("Error fetching trending stats:", err);
        if (isMounted) setError("Could not load stats. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTrendingCounts();

    return () => {
      isMounted = false;
    };
  }, []);

  const hasData = Array.isArray(data) && data.length > 0;
  const top10 = hasData
  ? [...data].sort((a,b) => b.appearances - a.appearances).slice(0, 10)
  : [];

  return (
    <div className="stats-container">
      <h2>📊 Stats Dashboard</h2>

      <section className="stats-card">
        <h3>Top 10 Most Frequently Trending Movies</h3>

        {loading && <p>Loading chart…</p>}
        {!loading && error && <p className="error-text">{error}</p>}
        {!loading && !error && !hasData && <p>No trending data yet.</p>}

        {!loading && !error && hasData && (
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={420}>
              <BarChart
                data={top10}
                margin={{ top: 20, right: 30, left: 10, bottom: 90 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="title"
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                  height={120}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="appearances" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <div className="stats-grid">
        <section className="stats-card">
          <h3>Movies Trended Per Week</h3>
          <WeeklyTrendChart />
        </section>

        <section className="stats-card">
          <h3>Genre Distribution</h3>
          <GenrePieChart />
        </section>
      </div>
    </div>
  );
};

export default Stats;
