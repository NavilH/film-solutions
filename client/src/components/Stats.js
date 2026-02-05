import React, { useEffect, useState } from "react";
import axios from "axios";
import WeeklyTrendChart from "./WeeklyTrendChart";
import GenrePieChart from "./GenrePieChart";
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
  const sampleData = [
    { title: "Test A", appearances: 10 },
    { title: "Test B", appearances: 15 }
  ];
  

  useEffect(() => {
    axios.get("http://localhost:5001/api/stats/trending-count")
      .then(res => {
        setData(res.data);
        console.log("📈 Trending data:", res.data);  // Add this line
      })
      .catch(err => console.error("Error fetching trending stats:", err));
  }, []);
  

  return (
    <div className="stats-container">
      <h2>📊 Most Frequently Trending Movies</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="title"
            angle={-30}
            textAnchor="end"
            interval={0}
            height={140}
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="appearances" fill="#8884d8" />
        </BarChart>
        <WeeklyTrendChart/>
        <GenrePieChart/>
      </ResponsiveContainer>
    </div>
  );
};

export default Stats;
