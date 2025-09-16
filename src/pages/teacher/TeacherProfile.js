// src/pages/teacher/TeacherProfile.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // ✅ Import useNavigate and Link
import axios from 'axios';
import Footer from '../../components/Footer';

const TeacherProfile = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const backendUrl = 'http://localhost:3000'; // Change this if your backend URL is different

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
    setError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('teacherName');
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }

    const teacherId = localStorage.getItem('teacherId'); // Make sure to store this on login

    if (!teacherId) {
      setError('Teacher ID not found. Please log in again.');
      return;
    }

    try {
      const response = await axios.put(`${backendUrl}/api/teacher/change-password`, {
  teacherId,
  currentPassword: formData.currentPassword,
  newPassword: formData.newPassword,
});

      setMessage(response.data.message);
      setFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Error changing password');
    }
  };

  const containerStyle = {
  width: '50%',
  minWidth: '300px',
  margin: '80px auto', // vertically and horizontally centered
  padding: '30px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.15)',
};

  return (
    <>
      {/* You can create and use TeacherNavbar or reuse the navbar from TeacherPortal */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
        <span className="navbar-brand">Teacher Portal</span>
        <div className="collapse navbar-collapse justify-content-end">
          <ul className="navbar-nav">
            <li className="nav-item"><Link className="nav-link" to="/teacher/profile">Profile Settings</Link></li>
            <li className="nav-item"><button className="btn btn-outline-light" onClick={handleLogout}>Logout</button></li>
          </ul>
        </div>
      </nav>

      <div style={containerStyle}>
        <h2 className="text-center mb-4">Change Password</h2>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Current Password</label>
            <input
              type="password"
              className="form-control"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>New Password</label>
            <input
              type="password"
              className="form-control"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Confirm New Password</label>
            <input
              type="password"
              className="form-control"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">Update Password</button>
          </div>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default TeacherProfile;
