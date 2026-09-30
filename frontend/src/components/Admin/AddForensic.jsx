// src/components/Admin/AddForensic.jsx
import React, { useState } from 'react';
import axios from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from 'mdb-react-ui-kit';
import { ToastContainer, toast } from 'react-toastify'; // ✅ Import Toast
import 'react-toastify/dist/ReactToastify.css';          // ✅ Import Toast CSS

const AddForensic = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:3000/api/admin/add-forensic-user",
        { username, password },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Forensic user added successfully!"); // ✅ Success Toast
      setUsername("");
      setPassword("");
    } catch (error) {
      const message = error.response?.data?.message || "Error adding forensic user";
      toast.error(message); // ✅ Error Toast
    }
  };

  return (
    <MDBContainer
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', padding: 0 }}
    >
      <div
        className="bg-image position-absolute w-100 h-100"
        style={{
          backgroundImage: 'url(https://media.istockphoto.com/id/837664122/photo/crime-scene.jpg?s=612x612&w=0&k=20&c=ixWE6C5Lyd5ypvGiDT1ncD-wreo8o3c5wvo8DUjvH8E=)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1,
        }}
      ></div>

      <MDBCard
        className="shadow-5"
        style={{
          width: '100%',
          maxWidth: '500px',
          background: 'hsla(0, 0%, 100%, 0.85)',
          backdropFilter: 'blur(15px)',
          borderRadius: '20px',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
        }}
      >
        <MDBCardBody className="p-5 text-center">
          <h2 className="fw-bold mb-4">Add Forensic User</h2>
          <form onSubmit={handleSubmit}>
            <MDBInput
              wrapperClass="mb-4"
              label="Username"
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <MDBInput
              wrapperClass="mb-4"
              label="Password"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <MDBBtn type="submit" className="w-100 mb-3" size="md" color="warning">
              Add Forensic
            </MDBBtn>
          </form>
        </MDBCardBody>
      </MDBCard>

      {/* ✅ Toast container for notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </MDBContainer>
  );
};

export default AddForensic;
