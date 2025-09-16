import React, { useState } from 'react';
import axios from 'axios';
import StudentNavbar from '../../components/StudentNavbar';
import Footer from '../../components/Footer';

const StudentProfile = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const studentId = localStorage.getItem('studentId'); // ✅ Get from localStorage

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmNewPassword } = formData;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/api/student/change-password', {
        studentId, // ✅ Send to backend
        currentPassword,
        newPassword
      });

      setMessage(res.data.message);
      setFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Error changing password.';
      setError(msg);
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
      <StudentNavbar />
      <div className="container mt-5" style={containerStyle}>
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

export default StudentProfile;
