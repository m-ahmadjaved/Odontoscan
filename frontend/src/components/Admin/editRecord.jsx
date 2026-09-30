import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./editRecord.css"; // Import the CSS file

const EditRecordPage = () => {
  const { id } = useParams(); // Get the record ID from the URL
  const [record, setRecord] = useState({
    name: "",
    age: "",
    gender: "",
    province: "",
    photo: "",
    radiograph: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPhoto, setNewPhoto] = useState(null); // For holding the new photo file
  const [newRadiograph, setNewRadiograph] = useState(null); // For holding the new radiograph file
  const navigate = useNavigate();

  // List of provinces (you can modify it to include real data)
  const provinces = ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan"];

  useEffect(() => {
    const fetchRecord = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login"); // If not authenticated, redirect to login
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/api/record/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          setRecord(data.record);
        } else {
          setError(data.message || "Failed to fetch record.");
        }
      } catch (err) {
        setError("Failed to fetch record.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecord((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle photo file change
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhoto(file); // Set the selected photo file
    }
  };

  // Handle radiograph file change
  const handleRadiographChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewRadiograph(file); // Set the selected radiograph file
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("name", record.name);
    formData.append("age", record.age);
    formData.append("gender", record.gender);
    formData.append("province", record.province);

    // If a new photo is selected, append it to the form data
    if (newPhoto) {
      formData.append("photo", newPhoto);
    }

    // If a new radiograph is selected, append it to the form data
    if (newRadiograph) {
      formData.append("radiograph", newRadiograph);
    }

    try {
      const response = await fetch(`http://localhost:3000/api/update/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // Send the form data (with updated files, if any)
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/admin/view-records");
      } else {
        setError(data.message || "Failed to update record.");
      }
    } catch (err) {
      setError("Failed to update record.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!record) return <p>Record not found.</p>;

  return (
    <div className="edit-record-container">
      <div className="edit-record-form">
        <h2>Edit Record</h2>
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={record.name}
            onChange={handleChange}
          />

          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={record.age}
            onChange={handleChange}
          />

          <label>Gender:</label>
          <select name="gender" value={record.gender} onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <label>Province:</label>
          <select
            name="province"
            value={record.province}
            onChange={handleChange}
          >
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>

          <label>Photo:</label>
          <input type="file" onChange={handlePhotoChange} accept="image/*" />
          {record.photo && !newPhoto && (
            <div>
              <img
                src={`http://localhost:3000/${record.photo}`}
                alt="Record Photo"
                width="100"
              />
            </div>
          )}

          <label>Radiograph:</label>
          <input
            type="file"
            onChange={handleRadiographChange}
            accept="image/*"
          />
          {record.radiograph && !newRadiograph && (
            <div>
              <img
                src={`http://localhost:3000/${record.radiograph}`}
                alt="Record Radiograph"
                width="100"
              />
            </div>
          )}

          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default EditRecordPage;
