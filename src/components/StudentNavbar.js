import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const StudentNavbar = () => {
  const navigate = useNavigate();
  const logout = () => navigate('/login');

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
      <span className="navbar-brand">Student Portal</span>
      <div className="collapse navbar-collapse justify-content-end">
        <ul className="navbar-nav me-auto">
          <li className="nav-item"><Link className="nav-link" to="/student/StudentHome">Home</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/student/study-materials">Study Materials</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/student/question-papers">Question Papers</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/student/timetable">Timetable</Link></li>
        </ul>
        <ul className="navbar-nav">
          <li className="nav-item"><Link className="nav-link" to="/student/profile">Profile Settings</Link></li>
          <li className="nav-item"><button className="btn btn-outline-light" onClick={logout}>Logout</button></li>
        </ul>
      </div>
    </nav>
  );
};

export default StudentNavbar;