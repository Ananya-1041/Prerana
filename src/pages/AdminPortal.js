import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const AdminPortal = () => {
    const adminName = "Admin";
    const navigate = useNavigate();
    const [activeForm, setActiveForm] = useState({});

    // --- Student State ---
    const [addStudentData, setAddStudentData] = useState({ studentId: '', password: '', name: '', className: '', phone: '' });
    const [deleteStudentId, setDeleteStudentId] = useState('');
    const [addStudentError, setAddStudentError] = useState('');
    const [deleteStudentError, setDeleteStudentError] = useState('');
    const [studentSuccessMessage, setStudentSuccessMessage] = useState(''); // New state

    // --- Teacher State ---
    const [addTeacherData, setAddTeacherData] = useState({ teacherId: '', password: '', name: '', subject: '', phone: '' });
    const [deleteTeacherId, setDeleteTeacherId] = useState('');
    const [addTeacherError, setAddTeacherError] = useState('');
    const [deleteTeacherError, setDeleteTeacherError] = useState('');
    const [teacherSuccessMessage, setTeacherSuccessMessage] = useState(''); // New state

    // --- Announcement State ---
    const [addAnnouncementData, setAddAnnouncementData] = useState({ title: '', date: '', description: '' });
    const [deleteAnnouncementTitle, setDeleteAnnouncementTitle] = useState('');
    const [addAnnouncementError, setAddAnnouncementError] = useState('');
    const [deleteAnnouncementError, setDeleteAnnouncementError] = useState('');
    const [announcementSuccessMessage, setAnnouncementSuccessMessage] = useState(''); // New state

    // --- Event State ---
    const [addEventData, setAddEventData] = useState({ name: '', date: '', time: '', description: '' });
    const [deleteEventName, setDeleteEventName] = useState('');
    const [addEventError, setAddEventError] = useState('');
    const [deleteEventError, setDeleteEventError] = useState('');
    const [eventSuccessMessage, setEventSuccessMessage] = useState(''); // New state

    // --- Contact Submissions State ---
    const [contactSubmissions, setContactSubmissions] = useState([]);
    const [contactSubmissionsError, setContactSubmissionsError] = useState('');

    const backendUrl = 'http://localhost:3000/api';

    useEffect(() => {
        fetchContactSubmissions();
    }, []);

    const fetchContactSubmissions = async () => {
        try {
            const response = await axios.get(`${backendUrl}/contact-submissions`);
            setContactSubmissions(response.data);
        } catch (error) {
            console.error('Error fetching contact submissions:', error);
            setContactSubmissionsError('Failed to fetch contact submissions.');
        }
    };

    const toggleForm = (section, action) => {
        setActiveForm({ ...activeForm, [section]: action });

        // Clear specific success messages on form toggle
        if (section === 'students') setStudentSuccessMessage('');
        if (section === 'teachers') setTeacherSuccessMessage('');
        if (section === 'announcements') setAnnouncementSuccessMessage('');
        if (section === 'events') setEventSuccessMessage('');

        // Reset forms and errors (as before)
        if (action === 'add' && section === 'students') {
            setAddStudentData({ studentId: '', password: '', name: '', className: '', phone: '' });
            setAddStudentError('');
        }
        if (action === 'delete' && section === 'students') {
            setDeleteStudentId('');
            setDeleteStudentError('');
        }
        if (action === 'add' && section === 'teachers') {
            setAddTeacherData({ teacherId: '', password: '', name: '', subject: '', phone: '' });
            setAddTeacherError('');
        }
        if (action === 'delete' && section === 'teachers') {
            setDeleteTeacherId('');
            setDeleteTeacherError('');
        }
        if (action === 'add' && section === 'announcements') {
            setAddAnnouncementData({ title: '', date: '', description: '' });
            setAddAnnouncementError('');
        }
        if (action === 'delete' && section === 'announcements') {
            setDeleteAnnouncementTitle('');
            setDeleteAnnouncementError('');
        }
        if (action === 'add' && section === 'events') {
            setAddEventData({ name: '', date: '', time: '', description: '' });
            setAddEventError('');
        }
        if (action === 'delete' && section === 'events') {
            setDeleteEventName('');
            setDeleteEventError('');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    // --- Student Handlers ---
    const handleAddStudentChange = (e) => { setAddStudentData({ ...addStudentData, [e.target.name]: e.target.value }); };
    const handleDeleteStudentChange = (e) => { setDeleteStudentId(e.target.value); };

    const handleAddStudentSubmit = async (e) => {
        e.preventDefault();
        setAddStudentError('');

        try {
            const response = await axios.post(`${backendUrl}/students`, addStudentData);
            setStudentSuccessMessage(response.data.message); // Update student-specific success message
            setAddStudentData({ studentId: '', password: '', name: '', className: '', phone: '' });
        } catch (error) {
            console.error('Error adding student:', error);
            setAddStudentError(error.response?.data.message || 'Failed to add student.');
        }
    };

    const handleDeleteStudentSubmit = async (e) => {
        e.preventDefault();
        setDeleteStudentError('');

        if (!deleteStudentId) {
            setDeleteStudentError('Please enter the Student ID to delete.');
            return;
        }

        try {
            const response = await axios.delete(`${backendUrl}/students/${deleteStudentId}`);
            setStudentSuccessMessage(response.data.message); // Update student-specific success message
            setDeleteStudentId('');
        } catch (error) {
            console.error('Error deleting student:', error);
            setDeleteStudentError(error.response?.data.message || 'Failed to delete student.');
        }
    };

    // --- Teacher Handlers ---
    const handleAddTeacherChange = (e) => { setAddTeacherData({ ...addTeacherData, [e.target.name]: e.target.value }); };
    const handleDeleteTeacherChange = (e) => { setDeleteTeacherId(e.target.value); };

    const handleAddTeacherSubmit = async (e) => {
        e.preventDefault();
        setAddTeacherError('');

        try {
            const response = await axios.post(`${backendUrl}/teachers`, addTeacherData);
            setTeacherSuccessMessage(response.data.message); // Update teacher-specific success message
            setAddTeacherData({ teacherId: '', password: '', name: '', subject: '', phone: '' });
        } catch (error) {
            console.error('Error adding teacher:', error);
            setAddTeacherError(error.response?.data.message || 'Failed to add teacher.');
        }
    };

    const handleDeleteTeacherSubmit = async (e) => {
        e.preventDefault();
        setDeleteTeacherError('');

        if (!deleteTeacherId) {
            setDeleteTeacherError('Please enter the Teacher ID to delete.');
            return;
        }

        try {
            const response = await axios.delete(`${backendUrl}/teachers/${deleteTeacherId}`);
            setTeacherSuccessMessage(response.data.message); // Update teacher-specific success message
            setDeleteTeacherId('');
        } catch (error) {
            console.error('Error deleting teacher:', error);
            setDeleteTeacherError(error.response?.data.message || 'Failed to delete teacher.');
        }
    };

    // --- Announcement Handlers ---
    const handleAddAnnouncementChange = (e) => { setAddAnnouncementData({ ...addAnnouncementData, [e.target.name]: e.target.value }); };
    const handleDeleteAnnouncementChange = (e) => { setDeleteAnnouncementTitle(e.target.value); };

    const handleAddAnnouncementSubmit = async (e) => {
        e.preventDefault();
        setAddAnnouncementError('');

        try {
            const response = await axios.post(`${backendUrl}/announcements`, addAnnouncementData);
            setAnnouncementSuccessMessage(response.data.message); // Update announcement-specific success message
            setAddAnnouncementData({ title: '', date: '', description: '' });
        } catch (error) {
            console.error('Error adding announcement:', error);
            setAddAnnouncementError(error.response?.data.message || 'Failed to add announcement.');
        }
    };

    const handleDeleteAnnouncementSubmit = async (e) => {
        e.preventDefault();
        setDeleteAnnouncementError('');

        if (!deleteAnnouncementTitle) {
            setDeleteAnnouncementError('Please enter the Announcement Title to delete.');
            return;
        }

        try {
            const response = await axios.delete(`${backendUrl}/announcements/${deleteAnnouncementTitle}`);
            setAnnouncementSuccessMessage(response.data.message); // Update announcement-specific success message
            setDeleteAnnouncementTitle('');
        } catch (error) {
            console.error('Error deleting announcement:', error);
            setDeleteAnnouncementError(error.response?.data.message || 'Failed to delete announcement.');
        }
    };

    // --- Event Handlers ---
    const handleAddEventChange = (e) => {
        setAddEventData({ ...addEventData, [e.target.name]: e.target.value });
    };

    const handleDeleteEventChange = (e) => {
        setDeleteEventName(e.target.value);
    };

    const handleAddEventSubmit = async (e) => {
        e.preventDefault();
        setAddEventError('');
        try {
            const response = await axios.post(`${backendUrl}/events`, addEventData);
            setEventSuccessMessage(response.data.message); // Update event-specific success message
            setAddEventData({ name: '', date: '', time: '', description: '' }); // Reset form
        } catch (error) {
            console.error('Error adding event:', error);
            setAddEventError(error.response?.data.message || 'Failed to add event');
        }
    };

    const handleDeleteEventSubmit = async (e) => {
        e.preventDefault();
        setDeleteEventError('');

        if (!deleteEventName) {
            setDeleteEventError('Please enter the Event Name to delete.');
            return;
        }

        try {
            const response = await axios.delete(`${backendUrl}/events/${deleteEventName}`);
            setEventSuccessMessage(response.data.message); // Update event-specific success message
            setDeleteEventName('');
        } catch (error) {
            console.error('Error deleting event:', error);
            setDeleteEventError(error.response?.data.message || 'Failed to delete event.');
        }
    };

    const cardStyle = {
        minWidth: '250px',
        flex: '1',
        margin: '10px'
    };

    return (
        <>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
                <span className="navbar-brand">Admin Portal</span>
                <div className="ms-auto">
                    <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
                </div>
            </nav>

            {/* Welcome Message */}
            <div className="container text-center mt-4">
                <h3>Welcome Back, {adminName}!</h3>
            </div>

            {/* Cards */}
            <div className="container mt-4 d-flex flex-wrap justify-content-center">
                {/* Students Card */}
                <div className="card" style={cardStyle}>
                    <div className="card-body">
                        <h5 className="card-title">Students</h5>
                        <button className="btn btn-success me-2" onClick={() => toggleForm('students', 'add')}>Add</button>
                        <button className="btn btn-danger" onClick={() => toggleForm('students', 'delete')}>Delete</button>

                        {studentSuccessMessage && <div className="alert alert-success mt-2">{studentSuccessMessage}</div>} {/* Specific success message */}

                        {activeForm.students === 'add' && (
                            <form onSubmit={handleAddStudentSubmit}>
                                {addStudentError && <div className="alert alert-danger mt-2">{addStudentError}</div>}
                                <input className="form-control my-1" placeholder="Student ID" name="studentId" value={addStudentData.studentId} onChange={handleAddStudentChange} required />
                                <input type="password" className="form-control my-1" placeholder="Password" name="password" value={addStudentData.password} onChange={handleAddStudentChange} required />
                                <input className="form-control my-1" placeholder="Name" name="name" value={addStudentData.name} onChange={handleAddStudentChange} required />
                                <input className="form-control my-1" placeholder="Class" name="className" value={addStudentData.className} onChange={handleAddStudentChange} required />
                                <input className="form-control my-1" placeholder="Phone" name="phone" value={addStudentData.phone} onChange={handleAddStudentChange} required />
                                <button type="submit" className="btn btn-primary mt-2">Submit</button>
                            </form>
                        )}
                        {activeForm.students === 'delete' && (
                            <form onSubmit={handleDeleteStudentSubmit}>
                                {deleteStudentError && <div className="alert alert-danger mt-2">{deleteStudentError}</div>}
                                <input className="form-control my-1" placeholder="Student ID to Delete" value={deleteStudentId} onChange={handleDeleteStudentChange} required />
                                <button type="submit" className="btn btn-primary mt-2">Submit</button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Teachers Card */}
                <div className="card" style={cardStyle}>
                    <div className="card-body">
                        <h5 className="card-title">Teachers</h5>
                        <button className="btn btn-success me-2" onClick={() => toggleForm('teachers', 'add')}>Add</button>
                        <button className="btn btn-danger" onClick={() => toggleForm('teachers', 'delete')}>Delete</button>

                        {teacherSuccessMessage && <div className="alert alert-success mt-2">{teacherSuccessMessage}</div>} {/* Specific success message */}

                        {activeForm.teachers === 'add' && (
                            <form onSubmit={handleAddTeacherSubmit}>
                                {addTeacherError && <div className="alert alert-danger mt-2">{addTeacherError}</div>}
                                <input className="form-control my-1" placeholder="Teacher ID" name="teacherId" value={addTeacherData.teacherId} onChange={handleAddTeacherChange} required />
                                <input type="password" className="form-control my-1" placeholder="Password" name="password" value={addTeacherData.password} onChange={handleAddTeacherChange} required />
                                <input className="form-control my-1" placeholder="Name" name="name" value={addTeacherData.name} onChange={handleAddTeacherChange} required />
                                <input className="form-control my-1" placeholder="Subject" name="subject" value={addTeacherData.subject} onChange={handleAddTeacherChange} required />
                                <input className="form-control my-1" placeholder="Phone" name="phone" value={addTeacherData.phone} onChange={handleAddTeacherChange} required />
                                <button type="submit" className="btn btn-primary mt-2">Submit</button>
                            </form>
                        )}
                        {activeForm.teachers === 'delete' && (
                            <form onSubmit={handleDeleteTeacherSubmit}>
                                {deleteTeacherError && <div className="alert alert-danger mt-2">{deleteTeacherError}</div>}
                                <input className="form-control my-1" placeholder="Teacher ID to Delete" value={deleteTeacherId} onChange={handleDeleteTeacherChange} required />
                                <button type="submit" className="btn btn-primary mt-2">Submit</button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Announcements Card */}
                <div className="card" style={cardStyle}>
                    <div className="card-body">
                        <h5 className="card-title">Announcements</h5>
                        <button className="btn btn-success me-2" onClick={() => toggleForm('announcements', 'add')}>Add</button>
                        <button className="btn btn-danger" onClick={() => toggleForm('announcements', 'delete')}>Delete</button>

                        {announcementSuccessMessage && <div className="alert alert-success mt-2">{announcementSuccessMessage}</div>} {/* Specific success message */}

                        {activeForm.announcements === 'add' && (
                            <form onSubmit={handleAddAnnouncementSubmit}>
                                {addAnnouncementError && <div className="alert alert-danger mt-2">{addAnnouncementError}</div>}
                                <input className="form-control my-1" placeholder="Title" name="title" value={addAnnouncementData.title} onChange={handleAddAnnouncementChange} required />
                                <input type="date" className="form-control my-1" name="date" value={addAnnouncementData.date} onChange={handleAddAnnouncementChange} required />
                                <textarea className="form-control my-1" placeholder="Description" name="description" value={addAnnouncementData.description} onChange={handleAddAnnouncementChange} required />
                                <button type="submit" className="btn btn-primary mt-2">Submit</button>
                            </form>
                        )}
                        {activeForm.announcements === 'delete' && (
                            <form onSubmit={handleDeleteAnnouncementSubmit}>
                                {deleteAnnouncementError && <div className="alert alert-danger mt-2">{deleteAnnouncementError}</div>}
                                <input className="form-control my-1" placeholder="Announcement Title to Delete" value={deleteAnnouncementTitle} onChange={handleDeleteAnnouncementChange} required />
                                <button type="submit" className="btn btn-primary mt-2">Submit</button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Events Card */}
                <div className="card" style={cardStyle}>
                    <div className="card-body">
                        <h5 className="card-title">Events</h5>
                        <button className="btn btn-success me-2" onClick={() => toggleForm('events', 'add')}>Add</button>
                        <button className="btn btn-danger" onClick={() => toggleForm('events', 'delete')}>Delete</button>

                        {eventSuccessMessage && <div className="alert alert-success mt-2">{eventSuccessMessage}</div>} {/* Specific success message */}

                        {activeForm.events === 'add' && (
                            <form onSubmit={handleAddEventSubmit}>
                                {addEventError && <div className="alert alert-danger mt-2">{addEventError}</div>}
                                <input className="form-control my-1" placeholder="Name" name="name" value={addEventData.name} onChange={handleAddEventChange} required />
                                <input type="date" className="form-control my-1" name="date" value={addEventData.date} onChange={handleAddEventChange} required />
                                <input type="time" className="form-control my-1" name="time" value={addEventData.time} onChange={handleAddEventChange} required />
                                <textarea className="form-control my-1" placeholder="Description" name="description" value={addEventData.description} onChange={handleAddEventChange} required />
                                <button type="submit" className="btn btn-primary mt-2">Submit</button>
                            </form>
                        )}
                        {activeForm.events === 'delete' && (
                            <form onSubmit={handleDeleteEventSubmit}>
                                {deleteEventError && <div className="alert alert-danger mt-2">{deleteEventError}</div>}
                                <input className="form-control my-1" placeholder="Event Name to Delete" name="name" value={deleteEventName} onChange={handleDeleteEventChange} required />
                                <button type="submit" className="btn btn-primary mt-2">Submit</button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Contact Submissions Display */}
                <div className="card" style={{ ...cardStyle, minWidth: '100%', marginTop: '20px' }}>
                    <div className="card-body">
                        <h5 className="card-title">Contact Submissions</h5>
                        {contactSubmissionsError && <div className="alert alert-danger mt-2">{contactSubmissionsError}</div>}
                        {contactSubmissions.length === 0 && !contactSubmissionsError && (
                            <div className="alert alert-info mt-2">No contact submissions yet.</div>
                        )}
                        {contactSubmissions.length > 0 && (
                            <div className="table-responsive">
                                <table className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Subject</th>
                                            <th>Message</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contactSubmissions.map(submission => (
                                            <tr key={submission._id}>
                                                <td>{submission.name}</td>
                                                <td>{submission.email}</td>
                                                <td>{submission.phone}</td>
                                                <td>{submission.subject}</td>
                                                <td>{submission.message}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </>
    );
};

export default AdminPortal;