import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../../components/Footer';
import '../../styles/TeacherPortal.css';

const TeacherPortal = () => {
    const navigate = useNavigate();
    const [teacherName, setTeacherName] = useState('Teacher');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);

    useEffect(() => {
        const nameFromStorage = localStorage.getItem('teacherName') || 'Teacher';
        setTeacherName(nameFromStorage);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('teacherName');
        localStorage.removeItem('teacherId');
        navigate('/login');
    };

    const handleUpload = async (e, type) => {
        e.preventDefault();
        setIsUploading(true);
        setUploadStatus(null);

        const form = e.target;
        const formData = new FormData(form);

        // Log form data for debugging
        console.log('Upload type:', type);
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        let endpoint = '';
        if (type === 'Study Material') endpoint = '/api/studymaterials';
        else if (type === 'Question Paper') endpoint = '/api/questionpapers';
        else if (type === 'Timetable') endpoint = '/api/timetables';

        try {
            const response = await fetch(`http://localhost:3000${endpoint}`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setUploadStatus({ type: 'success', message: data.message });
                form.reset();
            } else {
                setUploadStatus({ type: 'error', message: 'Upload failed: ' + data.message });
            }
        } catch (err) {
            console.error('Upload error:', err);
            setUploadStatus({ type: 'error', message: 'Upload failed: ' + err.message });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
                <span className="navbar-brand">Teacher Portal</span>
                <div className="collapse navbar-collapse justify-content-end">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/teacher/profile">Profile Settings</Link>
                        </li>
                        <li className="nav-item">
                            <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
                        </li>
                    </ul>
                </div>
            </nav>

            <div className="container mt-4">
                <h2 className="text-center mb-4">Welcome Back, Teacher!</h2>
                <p className="text-center text-muted mb-4">Upload study materials, question papers, and timetables for your students</p>

                {uploadStatus && (
                    <div className={`alert ${uploadStatus.type === 'success' ? 'alert-success' : 'alert-danger'} mb-4`}>
                        <strong>{uploadStatus.type === 'success' ? 'Success!' : 'Error!'}</strong> {uploadStatus.message}
                    </div>
                )}

                <div className="row g-4">
                    {/* Study Materials */}
                    <div className="col-md-4">
                        <div className="card upload-card h-100">
                            <div className="card-header bg-primary text-white">
                                <h5 className="card-title mb-0">📚 Upload Study Materials</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={(e) => handleUpload(e, 'Study Material')} encType="multipart/form-data">
                                    <div className="mb-3">
                                        <label className="form-label">Subject *</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            name="subject" 
                                            placeholder="e.g., Mathematics, Physics" 
                                            required 
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Class *</label>
                                        <select className="form-control" name="class" required>
                                            <option value="">Select Class</option>
                                            <option value="8">Class 8</option>
                                            <option value="9">Class 9</option>
                                            <option value="10">Class 10</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Upload File *</label>
                                        <input 
                                            type="file" 
                                            name="file" 
                                            className="form-control" 
                                            accept=".pdf,.doc,.docx,.ppt,.pptx" 
                                            required 
                                        />
                                        <small className="text-muted">Supported: PDF, DOC, DOCX, PPT, PPTX</small>
                                    </div>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary w-100" 
                                        disabled={isUploading}
                                    >
                                        {isUploading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Uploading...
                                            </>
                                        ) : (
                                            'Upload Study Material'
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Question Papers */}
                    <div className="col-md-4">
                        <div className="card upload-card h-100">
                            <div className="card-header bg-success text-white">
                                <h5 className="card-title mb-0">📝 Upload Question Papers</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={(e) => handleUpload(e, 'Question Paper')} encType="multipart/form-data">
                                    <div className="mb-3">
                                        <label className="form-label">Subject *</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            name="subject" 
                                            placeholder="e.g., Mathematics, Physics" 
                                            required 
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Class *</label>
                                        <select className="form-control" name="class" required>
                                            <option value="">Select Class</option>
                                            <option value="8">Class 8</option>
                                            <option value="9">Class 9</option>
                                            <option value="10">Class 10</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Year *</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            name="year" 
                                            placeholder="e.g., 2024, 2023" 
                                            required 
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Exam Type</label>
                                        <select className="form-control" name="type">
                                            <option value="">Select Type</option>
                                            <option value="Mid-term">Mid-term</option>
                                            <option value="Final">Final</option>
                                            <option value="Unit Test">Unit Test</option>
                                            <option value="Practice">Practice</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Upload File *</label>
                                        <input 
                                            type="file" 
                                            name="file" 
                                            className="form-control" 
                                            accept=".pdf" 
                                            required 
                                        />
                                        <small className="text-muted">Only PDF files are supported</small>
                                    </div>
                                    <button 
                                        type="submit" 
                                        className="btn btn-success w-100" 
                                        disabled={isUploading}
                                    >
                                        {isUploading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Uploading...
                                            </>
                                        ) : (
                                            'Upload Question Paper'
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Timetables */}
                    <div className="col-md-4">
                        <div className="card upload-card h-100">
                            <div className="card-header bg-warning text-dark">
                                <h5 className="card-title mb-0">📅 Upload Timetables</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={(e) => handleUpload(e, 'Timetable')} encType="multipart/form-data">
                                    <div className="mb-3">
                                        <label className="form-label">Class *</label>
                                        <select className="form-control" name="class" required>
                                            <option value="">Select Class</option>
                                            <option value="8">Class 8</option>
                                            <option value="9">Class 9</option>
                                            <option value="10">Class 10</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Upload File *</label>
                                        <input 
                                            type="file" 
                                            name="file" 
                                            className="form-control" 
                                            accept=".pdf,.jpg,.jpeg,.png" 
                                            required 
                                        />
                                        <small className="text-muted">Supported: PDF, JPG, PNG</small>
                                    </div>
                                    <div className="mb-4"></div> {/* Spacer for alignment */}
                                    <button 
                                        type="submit" 
                                        className="btn btn-warning w-100" 
                                        disabled={isUploading}
                                    >
                                        {isUploading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Uploading...
                                            </>
                                        ) : (
                                            'Upload Timetable'
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="alert alert-info mt-4" role="alert">
                    <strong>📌 Upload Guidelines:</strong>
                    <ul className="mb-0 mt-2">
                        <li>Study materials will be visible only to students of the selected class</li>
                        <li>Question papers will be visible to all students</li>
                        <li>Make sure file names are descriptive and professional</li>
                        <li>Maximum file size: 10MB per upload</li>
                    </ul>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default TeacherPortal;