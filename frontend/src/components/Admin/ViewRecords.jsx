import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Delete } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ShowAllRecords.css"; 

const ShowAllRecords = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [filterGender, setFilterGender] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setAuthError("You must be logged in to view records.");
          toast.error("You must be logged in to view records.");
          navigate("/login");
          return;
        }
        const response = await fetch("http://localhost:3000/api/record/showAllRecords", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setRecords(data.records);
          setFilteredRecords(data.records);
        } else {
          setError(data.message || "Failed to fetch records.");
          toast.error(data.message || "Failed to fetch records.");
        }
      } catch (err) {
        setError("Failed to fetch records.");
        toast.error("Failed to fetch records.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [navigate]);

  useEffect(() => {
    let filtered = records;
    if (filterGender !== "all") {
      filtered = filtered.filter((r) => r.gender === filterGender);
    }
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((r) =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredRecords(filtered);
  }, [filterGender, searchQuery, records]);

  const buildImageUrl = (path) => `http://localhost:3000/${path}`;

  const openImageModal = (imageUrl) => setSelectedImage(imageUrl);

  const closeImageModal = () => setSelectedImage(null);

  const handleEdit = (id) => navigate(`/admin/edit-record/${id}`);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthError("You must be logged in to delete records.");
      toast.error("You must be logged in to delete records.");
      navigate("/login");
      return;
    }
    const confirmed = window.confirm("Are you sure you want to delete this record?");
    if (confirmed) {
      try {
        const response = await fetch(`http://localhost:3000/api/delete/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setRecords(records.filter((r) => r._id !== id));
          setFilteredRecords(filteredRecords.filter((r) => r._id !== id));
          toast.success("Record deleted successfully!");
        } else {
          setError(data.message || "Failed to delete the record.");
          toast.error(data.message || "Failed to delete the record.");
        }
      } catch {
        setError("Failed to delete the record.");
        toast.error("Failed to delete the record.");
      }
    }
  };

  return (
    <div className="backgroundd">
    <div className="containerr">
      <h1 className="header">All Records</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterGender}
          onChange={(e) => setFilterGender(e.target.value)}
        >
          <option value="all">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      {loading && <p className="loading-text">Loading records...</p>}
      {authError && <p className="error-message">{authError}</p>}
      {error && <p className="error-message">{error}</p>}

      {filteredRecords.length === 0 && !loading && <p className="no-records">No records found.</p>}

      <div className="cards-container">
        {filteredRecords.map((record) => (
          <div key={record._id} className="card">
            <div className="card-header">
              <h2>{record.name}</h2>
              <div className="action-icons">
                <Edit
                  className="icon edit-icon"
                  title="Edit"
                  onClick={() => handleEdit(record._id)}
                />
                <Delete
                  className="icon delete-icon"
                  title="Delete"
                  onClick={() => handleDelete(record._id)}
                />
              </div>
            </div>
            <div className="card-body">
              <p><strong>Age:</strong> {record.age}</p>
              <p><strong>Gender:</strong> {record.gender}</p>
              <p><strong>Province:</strong> {record.province}</p>
              <div className="images-row">
                <div className="image-wrapper">
                  <p>Photo</p>
                  <img
                    src={buildImageUrl(record.photo)}
                    alt={`${record.name} photo`}
                    onClick={() => openImageModal(buildImageUrl(record.photo))}
                    className="image-thumb"
                  />
                </div>
                <div className="image-wrapper">
                  <p>Radiograph</p>
                  <img
                    src={buildImageUrl(record.radiograph)}
                    alt={`${record.name} radiograph`}
                    onClick={() => openImageModal(buildImageUrl(record.radiograph))}
                    className="image-thumb"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="modal" onClick={closeImageModal}>
          <span className="close-btn" onClick={closeImageModal}>
            &times;
          </span>
          <img src={selectedImage} alt="Zoomed content" className="modal-content" />
        </div>
      )}

      <ToastContainer />
    </div>
    </div>
  );
};

export default ShowAllRecords;
