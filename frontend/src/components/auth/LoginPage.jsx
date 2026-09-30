import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon
} from 'mdb-react-ui-kit';

import './LoginPage.css'; // Optional if you want extra styling

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        username,
        password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);

      if (response.data.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (response.data.role === 'forensic') {
        navigate('/match-radiographs');
      }
    } catch (error) {
      setErrorMessage('Invalid username or password');
    }
  };

  return (
    <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden' style={{ 
        minHeight: '100vh',  // full viewport height 
        display: 'flex', 
        alignItems: 'center',  // vertical center
        justifyContent: 'center', // horizontal center (for small screens)
      }}>

      <MDBRow>

        <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center' style={{ position: 'relative', zIndex: 1 }}>

          <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{color: 'hsl(218, 81%, 95%)'}}>
            Welcome Back<br />
            <span style={{color: 'hsl(218, 81%, 75%)'}}>Login to your account</span>
          </h1>

          <p className='px-3' style={{color: 'hsl(218, 81%, 85%)'}}>
            Use your credentials to access the Dental Biometric System.
          </p>

        </MDBCol>

        <MDBCol md='6' className='position-relative'>

          <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
          <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

          <MDBCard className='my-5 bg-glass'>
            <MDBCardBody className='p-5'>

              <form onSubmit={handleSubmit}>
                <MDBInput
                  wrapperClass='mb-4'
                  label='Username'
                  id='formUsername'
                  type='text'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />

                <MDBInput
                  wrapperClass='mb-4'
                  label='Password'
                  id='formPassword'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {errorMessage && (
                  <p className="text-danger text-center mb-3">{errorMessage}</p>
                )}

                <MDBBtn type='submit' className='w-100 mb-4' size='md'>
                  Login
                </MDBBtn>
              </form>

              <div className="text-center">
                <p>or sign in with:</p>

                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon='facebook-f' size="sm" />
                </MDBBtn>

                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon='twitter' size="sm" />
                </MDBBtn>

                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon='google' size="sm" />
                </MDBBtn>

                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon='github' size="sm" />
                </MDBBtn>
              </div>

            </MDBCardBody>
          </MDBCard>

        </MDBCol>

      </MDBRow>

    </MDBContainer>
  );
};

export default LoginPage;
