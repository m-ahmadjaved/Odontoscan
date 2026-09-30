import React, { useState, useRef } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";

const MatchRadiographPage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [matchData, setMatchData] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please upload a radiograph.");
      setMessage("");
      return;
    }

    const formData = new FormData();
    formData.append("radiograph", file);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not authorized. Please log in again.");
      setMessage("");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/radiographs/match",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Error matching radiograph");
      }

      const data = await response.json();
      setMatchData(data);
      setMessage("Match found!");
      setError("");
      fileInputRef.current.value = null;
      setFile(null);
    } catch (err) {
      setError(err.message);
      setMessage("");
      setMatchData(null);
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
              {/* Show left image ONLY if no match found */}
              {!matchData && (
                <MDBCol md="6" className="d-none d-md-block">
                  <MDBCardImage
                    src="https://media.istockphoto.com/id/1287022191/photo/teleroentgenographic-x-ray-image.jpg?s=612x612&w=0&k=20&c=zeWK1txQVKVjoQAPi497WQfVC1g3O53FDOZ_6owGv4w="
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
              )}

              <MDBCol md={matchData ? "12" : "6"}>
                <MDBCardBody className="text-black d-flex flex-column justify-content-center">
                  <h4
                    className="mb-4 fw-bold text-center"
                    style={{ color: "#007BFF" }}
                  >
                    Match Radiograph
                  </h4>

                  {/* Show form ONLY if no matchData */}
                  {!matchData && (
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label htmlFor="radiograph" className="form-label">
                          Upload Radiograph
                        </label>
                        <input
                          type="file"
                          id="radiograph"
                          className="form-control"
                          onChange={handleFileChange}
                          ref={fileInputRef}
                          required
                        />
                      </div>

                      <div className="d-flex justify-content-end">
                        <MDBBtn type="submit" color="primary">
                          Match Radiograph
                        </MDBBtn>
                      </div>
                    </form>
                  )}

                  {message && (
                    <div className="alert alert-success mt-4" role="alert">
                      {message}
                    </div>
                  )}
                  {error && (
                    <div className="alert alert-danger mt-4" role="alert">
                      {error}
                    </div>
                  )}

                  {/* Show matched data ONLY if available */}
                  {matchData && (
                    <div className="mt-4">
                      <h5>Best Match Found:</h5>
                      <p>
                        <strong>Name:</strong> {matchData.matchedRecord.name}
                      </p>
                      <p>
                        <strong>Age:</strong> {matchData.matchedRecord.age}
                      </p>
                      <p>
                        <strong>Gender:</strong> {matchData.matchedRecord.gender}
                      </p>
                      <p>
                        <strong>Province:</strong> {matchData.matchedRecord.province}
                      </p>
                      <p>
                        <strong>Similarity Score:</strong> {matchData.similarity}
                      </p>
                      {matchData.matchedRecord.photoUrl && (
                        <div className="mt-3">
                          <img
                            src={matchData.matchedRecord.photoUrl}
                            alt="Matched Radiograph"
                            className="img-fluid rounded"
                            style={{ maxHeight: "300px", objectFit: "cover" }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </MDBCardBody>
              </MDBCol>
            </MDBRow>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default MatchRadiographPage;
