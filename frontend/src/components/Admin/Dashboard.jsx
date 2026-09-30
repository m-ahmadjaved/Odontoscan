import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import backgroundImage from "../../assets/biometric3.jpg";
import {
  Upload as UploadIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  AddCircle as AddCircleIcon,
  Delete as DeleteIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";

import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();

  const [recordCount, setRecordCount] = useState(0);
  const [userRoles, setUserRoles] = useState({});
  const [provinceData, setProvinceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const recordRes = await fetch("http://localhost:3000/api/dashboard/records/count");
        const userRes = await fetch("http://localhost:3000/api/dashboard/users/roles");
        const provinceRes = await fetch("http://localhost:3000/api/dashboard/records/provinces");

        if (!recordRes.ok) throw new Error("Failed to fetch record count");
        if (!userRes.ok) throw new Error("Failed to fetch user roles");
        if (!provinceRes.ok) throw new Error("Failed to fetch province data");

        const recordData = await recordRes.json();
        const userData = await userRes.json();
        const provinceJson = await provinceRes.json();

        setRecordCount(recordData.count || 0);
        setUserRoles(userData || {});
        setProvinceData(provinceJson || {});
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const recordChartData = {
    labels: ["Total Records"],
    datasets: [
      {
        label: "Records",
        data: [recordCount],
        backgroundColor: ["#4caf50"],
      },
    ],
  };

  const userChartData = {
    labels: Object.keys(userRoles),
    datasets: [
      {
        label: "User Roles",
        data: Object.values(userRoles),
        backgroundColor: ["#2196f3", "#ff9800", "#f44336", "#9c27b0"],
      },
    ],
  };

  const provinceChartData = {
    labels: Object.keys(provinceData),
    datasets: [
      {
        label: "Records by Province",
        data: Object.values(provinceData),
        backgroundColor: [
          "#3f51b5",
          "#00bcd4",
          "#ffeb3b",
          "#8bc34a",
          "#e91e63",
          "#795548",
          "#9c27b0",
        ],
      },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="dashboard-wrapper" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <button onClick={() => navigate("/admin/upload")}>
          <UploadIcon /> Upload Data
        </button>
        <button onClick={() => navigate("/admin/view-records")}>
          <VisibilityIcon /> View Records
        </button>
        <button onClick={() => navigate("/match-radiographs")}>
          <SearchIcon /> Match Radiographs
        </button>
        <button onClick={() => navigate("/admin/add-forensic")}>
          <AddCircleIcon /> Add Forensic
        </button>
        <button onClick={() => navigate("/admin/delete-all-records")}>
          <DeleteIcon /> Delete All Records
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          <ExitToAppIcon /> Sign Out
        </button>
      </div>

      <div className="dashboard-content">
        <h2>Dashboard Overview</h2>

        {loading && <div>Loading...</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}

        {!loading && !error && (
          <div className="charts">
            <div className="chart-box">
              <h3>Record Statistics</h3>
              <Bar data={recordChartData} />
            </div>
            <div className="chart-box">
              <h3>User Distribution</h3>
              <Bar data={userChartData} />
            </div>
            <div className="chart-box">
              <h3>Records by Province</h3>
              <Pie data={provinceChartData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
