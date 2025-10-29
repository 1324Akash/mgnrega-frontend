import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const [workers, setWorkers] = useState([]);
  const [name, setName] = useState("");
  const [village, setVillage] = useState("");
  const [loading, setLoading] = useState(true);
  const [district, setDistrict] = useState("Madurai");

  // 🔗 Use your Render backend URL here
  const API_URL = "https://mgnrega-backend-raqv.onrender.com";

  const districtData = {
    Madurai: [65, 78, 90, 80, 85],
    Salem: [55, 68, 72, 69, 80],
    Theni: [45, 60, 58, 62, 70],
    Dindigul: [70, 82, 88, 79, 91],
  };

  const labels = [
    "Work Completed",
    "Funds Used",
    "Active Workers",
    "Ongoing Works",
    "New Projects",
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: `${district} Performance`,
        data: districtData[district],
        backgroundColor: [
          "#4CAF50",
          "#2196F3",
          "#FFC107",
          "#FF5722",
          "#9C27B0",
        ],
        borderRadius: 10,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `${district} District Progress`,
        font: { size: 18 },
      },
    },
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/api/workers`)
      .then((res) => {
        setWorkers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching workers:", err);
        setLoading(false);
      });
  }, []);

  const addWorker = async () => {
    if (!name.trim() || !village.trim()) {
      alert("Please provide both name and village.");
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/api/workers`, {
        name,
        village,
      });
      setWorkers([...workers, res.data]);
      setName("");
      setVillage("");
    } catch (err) {
      console.error("Error adding worker:", err);
      alert("❌ Failed to add worker. Please try again.");
    }
  };

  const deleteWorker = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/workers/${id}`);
      setWorkers(workers.filter((w) => w._id !== id));
    } catch (err) {
      console.error("Error deleting worker:", err);
      alert("❌ Failed to delete worker. Please try again.");
    }
  };

  return (
    <div
      style={{
        fontFamily: "Poppins, sans-serif",
        background: "linear-gradient(-45deg, #e0f7fa, #f1f8e9, #fff3e0, #fce4ec)",
        backgroundSize: "400% 400%",
        animation: "gradientAnimation 15s ease infinite",
        minHeight: "100vh",
        padding: "20px",
        color: "#333",
      }}
    >
      <style>
        {`
          @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      <div
        style={{
          textAlign: "center",
          backgroundColor: "#2E8B57",
          color: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          marginBottom: "30px",
        }}
      >
        <h1>🌾 MGNREGA Worker Dashboard</h1>
        <p>Empowering Rural India through Transparency and Simplicity</p>
      </div>

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <input
          type="text"
          placeholder="👷‍♂️ Enter worker name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            marginRight: "10px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "200px",
          }}
        />
        <input
          type="text"
          placeholder="🏡 Enter village name"
          value={village}
          onChange={(e) => setVillage(e.target.value)}
          style={{
            marginRight: "10px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "200px",
          }}
        />
        <button
          onClick={addWorker}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
          }}
        >
          ➕ Add Worker
        </button>
      </div>

      <div style={{ textAlign: "center" }}>
        {loading ? (
          <p>Loading workers...</p>
        ) : workers.length === 0 ? (
          <p>No workers found 😞</p>
        ) : (
          <table
            style={{
              margin: "0 auto",
              borderCollapse: "collapse",
              width: "70%",
              backgroundColor: "white",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <thead style={{ backgroundColor: "#2196F3", color: "white" }}>
              <tr>
                <th style={{ padding: "12px" }}>👷 Name</th>
                <th style={{ padding: "12px" }}>🏡 Village</th>
                <th style={{ padding: "12px" }}>⚙️ Action</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((worker) => (
                <tr key={worker._id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "10px" }}>{worker.name}</td>
                  <td style={{ padding: "10px" }}>{worker.village}</td>
                  <td>
                    <button
                      onClick={() => deleteWorker(worker._id)}
                      style={{
                        backgroundColor: "#e74c3c",
                        color: "white",
                        border: "none",
                        padding: "6px 14px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      ❌ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: "50px", textAlign: "center" }}>
        <h2>📍 District Performance Overview</h2>
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #2196F3",
            marginBottom: "20px",
          }}
        >
          <option value="Madurai">Madurai</option>
          <option value="Salem">Salem</option>
          <option value="Theni">Theni</option>
          <option value="Dindigul">Dindigul</option>
        </select>
        <div
          style={{
            width: "70%",
            margin: "0 auto",
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      <footer
        style={{
          textAlign: "center",
          marginTop: "60px",
          color: "#555",
        }}
      >
        <p>🌿 Designed for Rural India | © 2025 MGNREGA Transparency Project</p>
      </footer>
    </div>
  );
}

export default App;
