import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./deleteAllRecords.css"; // Import custom CSS

const AdminDashboard = () => {
  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setAuthError("You must be logged in to view records.");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        "http://localhost:3000/api/record/showAllRecords",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRecords(response.data.records);
    } catch (err) {
      setAuthError("Failed to fetch records.");
    } finally {
      setLoading(false);
    }
  };

  const buildImageUrl = (path) => `http://localhost:3000/${path}`;

  const handleDeleteAll = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:3000/api/delete-all",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert(response.data.message);
      fetchRecords(); // Refresh records after deletion
      setShowModal(false); // Close modal after success
    } catch (error) {
      alert("An error occurred while deleting records!");
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>

      {loading ? (
        <p>Loading records...</p>
      ) : authError ? (
        <p className="error">{authError}</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>District</th>
                <th>Photo</th>
                <th>Radiograph</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record._id}>
                  <td>{record.name}</td>
                  <td>{record.age}</td>
                  <td>{record.gender}</td>
                  <td>{record.province}</td>
                  <td>
                    <img
                      src={buildImageUrl(record.photo)}
                      alt="Photo"
                      className="image-small"
                    />
                  </td>
                  <td>
                    <img
                      src={buildImageUrl(record.radiograph)}
                      alt="Radiograph"
                      className="image-small"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setShowModal(true)}>Delete All Records</button>
        </>
      )}

      {/* Modal for confirming deletion */}
      {showModal && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      animation: "fadeIn 0.3s ease",
    }}
  >
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
        padding: "30px 40px",
        maxWidth: "400px",
        width: "90%",
        textAlign: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ marginBottom: "20px", color: "#333" }}>
        Are you sure you want to delete all records?
      </h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <button
          onClick={closeModal}
          style={{
            padding: "10px 25px",
            borderRadius: "6px",
            border: "2px solid #6c757d",
            backgroundColor: "white",
            color: "#6c757d",
            cursor: "pointer",
            fontWeight: "600",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={e => (e.target.style.backgroundColor = "#6c757d", e.target.style.color = "white")}
          onMouseLeave={e => (e.target.style.backgroundColor = "white", e.target.style.color = "#6c757d")}
        >
          No
        </button>
        <button
          onClick={handleDeleteAll}
          style={{
            padding: "10px 25px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#dc3545",
            color: "white",
            cursor: "pointer",
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(220, 53, 69, 0.6)",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={e => (e.target.style.backgroundColor = "#b02a37")}
          onMouseLeave={e => (e.target.style.backgroundColor = "#dc3545")}
        >
          Yes
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default AdminDashboard;
