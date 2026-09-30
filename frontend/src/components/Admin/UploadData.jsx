import React, { useState, useRef } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBRadio,
} from "mdb-react-ui-kit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UploadData() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [province, setProvince] = useState("");
  const [photo, setPhoto] = useState(null);
  const [radiograph, setRadiograph] = useState(null);

  const photoInputRef = useRef(null);
  const radiographInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token not found. Please log in.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("age", age);
    formData.append("gender", gender);
    formData.append("province", province);
    formData.append("photo", photo);
    formData.append("radiograph", radiograph);

    try {
      const response = await fetch(
        "http://localhost:3000/api/forensic/upload-data",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast.success("Data uploaded successfully");
        setName("");
        setAge("");
        setGender("");
        setProvince("");
        setPhoto(null);
        setRadiograph(null);
        photoInputRef.current.value = null;
        radiographInputRef.current.value = null;
      } else {
        toast.error(result.message || "Failed to upload data");
      }
    } catch (error) {
      console.error("Error uploading data:", error);
      toast.error("Error uploading data. Please try again later.");
    }
  };

  return (
    <MDBContainer
      fluid
      style={{
        background: "radial-gradient(circle at top left, #d1e8ff, #a8cfff)",
        minHeight: "100vh",
      }}
    >
      <MDBRow className="d-flex justify-content-center align-items-center h-100">
        <MDBCol md="10" lg="8" xl="6">
          <MDBCard className="my-5 shadow" style={{ borderRadius: "25px" }}>
            <MDBRow className="g-0">
              <MDBCol md="6" className="d-none d-md-block">
                <MDBCardImage
                  src="https://images.unsplash.com/photo-1663185551550-f8f56529ac5e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZGVudGlzdCVFMiU4MCU5OXMlMjBvZmZpY2V8ZW58MHx8MHx8fDA%3D"
                  alt="Radiograph X-ray"
                  fluid
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                    borderTopLeftRadius: "25px",
                    borderBottomLeftRadius: "25px",
                  }}
                />
              </MDBCol>

              <MDBCol md="6">
                <MDBCardBody className="text-black d-flex flex-column justify-content-center">
                  <h4
                    className="mb-4 fw-bold text-center"
                    style={{ color: "#007BFF" }}
                  >
                    Upload Person Data
                  </h4>

                  <form onSubmit={handleSubmit}>
                    <MDBInput
                      label="Full Name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      wrapperClass="mb-3"
                      required
                    />

                    <MDBInput
                      label="Age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      wrapperClass="mb-3"
                      required
                    />

                    <div className="d-flex mb-3 align-items-center">
                      <label className="me-3 fw-semibold">Gender:</label>
                      <MDBRadio
                        name="gender"
                        label="Male"
                        value="male"
                        inline
                        checked={gender === "male"}
                        onChange={() => setGender("male")}
                      />
                      <MDBRadio
                        name="gender"
                        label="Female"
                        value="female"
                        inline
                        checked={gender === "female"}
                        onChange={() => setGender("female")}
                      />
                    </div>

                    <select
                      className="form-select mb-3"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      required
                    >
                      <option value="">Select Province</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Sindh">Sindh</option>
                      <option value="Balochistan">Balochistan</option>
                      <option value="Khyber Pakhtunkhwa">
                        Khyber Pakhtunkhwa
                      </option>
                    </select>

                    <div className="mb-3">
                      <label className="form-label">Upload Photo</label>
                      <input
                        type="file"
                        className="form-control"
                        ref={photoInputRef}
                        onChange={(e) => setPhoto(e.target.files[0])}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Upload Radiograph</label>
                      <input
                        type="file"
                        className="form-control"
                        ref={radiographInputRef}
                        onChange={(e) => setRadiograph(e.target.files[0])}
                        required
                      />
                    </div>

                    <div className="d-flex justify-content-end">
                      <MDBBtn type="submit" color="primary">
                        Submit Form
                      </MDBBtn>
                    </div>
                  </form>
                </MDBCardBody>
              </MDBCol>
            </MDBRow>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
