import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Login.css'; // Keep your existing styles
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    studentId: '',
    teacherId: '',
    adminId: '',
    password: ''
  });
  const backendUrl = 'http://localhost:3000';
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setLoginError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;
    const idField = role === 'student' ? 'studentId' : role === 'teacher' ? 'teacherId' : 'adminId';
    if (!formData[idField] || !formData.password) {
      isValid = false;
      setLoginError('Please fill in all fields.');
      return;
    }

    try {
      const loginData = { ...formData, role };
      const response = await axios.post(`${backendUrl}/api/login`, loginData);
      alert(response.data.message);
      localStorage.setItem('userRole', response.data.role);
      switch (response.data.role) {
        case 'student':
          localStorage.setItem('studentId', response.data.studentId); // ✅ store it
          navigate('/student/StudentHome');
          break;
        case 'teacher':
          localStorage.setItem('userRole', 'teacher');
          localStorage.setItem('teacherId', response.data.teacherId);
          localStorage.setItem('teacherName', response.data.teacherName);
          navigate('/teacher/TeacherHome');
          break;
        case 'admin':
          navigate('/admin/AdminHome');
          break;
        default:
          navigate('/home');
      }
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data.message : error.message);
      setLoginError(error.response ? error.response.data.message : 'Login failed. Please try again.');
    }
  };

  const containerStyle = {
    width: '50%',
    margin: '50px auto', // Centers horizontally with top and bottom margin
    padding: '20px',
    backgroundColor: '#f8f9fa', // Optional: Keep background color
    borderRadius: '5px',       // Optional: Keep border radius
    boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)' // Optional: Keep shadow
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5 d-flex justify-content-center"> {/* Center the container */}
        <div style={containerStyle}> {/* Apply the custom style */}
          <h2>Welcome back! Please enter your details</h2>
          <div className="btn-group d-flex mb-4" role="group">
            <button
              className={`btn btn-outline-primary ${role === 'student' ? 'active' : ''}`}
              onClick={() => setRole('student')}
            >
              Student
            </button>
            <button
              className={`btn btn-outline-primary ${role === 'teacher' ? 'active' : ''}`}
              onClick={() => setRole('teacher')}
            >
              Teacher
            </button>
            <button
              className={`btn btn-outline-primary ${role === 'admin' ? 'active' : ''}`}
              onClick={() => setRole('admin')}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {loginError && <div className="alert alert-danger">{loginError}</div>}

            {role === 'student' && (
              <>
                <div className="mb-3">
                  <input
                    type="text"
                    name="studentId"
                    placeholder="Student ID"
                    className="form-control"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">Login</button>
                </div>
              </>
            )}

            {role === 'teacher' && (
              <>
                <div className="mb-3">
                  <input
                    type="text"
                    name="teacherId"
                    placeholder="Teacher ID"
                    className="form-control"
                    value={formData.teacherId}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">Login</button>
                </div>
              </>
            )}

            {role === 'admin' && (
              <>
                <div className="mb-3">
                  <input
                    type="text"
                    name="adminId"
                    placeholder="Admin ID"
                    className="form-control"
                    value={formData.adminId}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">Login</button>
                </div>
              </>
            )}
          </form>

          <p className="text-muted small text-center mt-3">
            Login credentials are provided by your school administrator.<br />
            If you haven't received your login details, please contact your school's admin department.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;