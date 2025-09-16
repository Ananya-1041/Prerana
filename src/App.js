import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Announcements from './pages/Announcements';
import Events from './pages/Events';
import Contact from './pages/Contact';
import Login from './pages/Login';
import StudentPortalHome from './pages/student/StudentHome';
import StudyMaterials from './pages/student/StudyMaterials';
import QuestionPapers from './pages/student/QuestionPapers';
import Timetable from './pages/student/Timetable';
import TeacherPortalHome from './pages/teacher/TeacherPortal';
import AdminPortalHome from './pages/AdminPortal';
import StudentProfile from './pages/student/StudentProfile';
import TeacherProfile from './pages/teacher/TeacherProfile';

// Placeholder components for the new pages.  You'll create these.

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} /> {/* Redirect from / to /home */}
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/events" element={<Events />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />

        {/* Student Portal Routes */}
        <Route path="/student/StudentHome" element={<StudentPortalHome />} />
        <Route path="/student/study-materials" element={<StudyMaterials />} />
        <Route path="/student/question-papers" element={<QuestionPapers />} />
        <Route path="/student/timetable" element={<Timetable />} />
        <Route path="/student/profile" element={<StudentProfile />} />

        {/* Teacher Portal Routes */}
        <Route path="/teacher/TeacherHome" element={<TeacherPortalHome />} />
        <Route path="/teacher/profile" element={<TeacherProfile />} />
        {/* Add other teacher routes here as you create them */}

        {/* Admin Portal Routes */}
        <Route path="/admin/AdminHome" element={<AdminPortalHome />} />
        {/* Add other admin routes here as you create them */}

        {/* 404 Route (Optional) */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;