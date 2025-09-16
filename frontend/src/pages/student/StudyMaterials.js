// Modified StudyMaterials.js for students
import React, { useState, useEffect } from 'react';
import StudentNavbar from '../../components/StudentNavbar';
import StudentFooter from '../../components/StudentFooter';
import { FaDownload, FaSearch, FaEye } from 'react-icons/fa'; // Added FaEye
import { Table, Form, InputGroup, Alert } from 'react-bootstrap';

const StudyMaterials = () => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSubject, setFilterSubject] = useState('All');
    const [subjectOptions, setSubjectOptions] = useState(['All']);
    const studentId = localStorage.getItem('studentId');
    const [studentClass, setStudentClass] = useState(null);

    useEffect(() => {
        // First get the student's class
        if (studentId) {
            fetchStudentClass();
        }
    }, [studentId]);

    useEffect(() => {
        // Only fetch study materials once we know the student's class
        if (studentClass) {
            fetchStudyMaterials();
        }
    }, [studentClass, filterSubject, searchTerm]); // Re-fetch materials when filterSubject or searchTerm changes

    const fetchStudentClass = async () => {
        try {
            // Fetch student details to get their class
            const response = await fetch(`http://localhost:3000/api/student/details?studentId=${studentId}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            setStudentClass(data.class);
        } catch (error) {
            console.error("Could not fetch student details:", error);
            setError("Failed to load student information. Please try again later.");
            setLoading(false);
        }
    };

    const fetchStudyMaterials = async () => {
        setLoading(true);
        setError('');

        try {
            if (!studentId || !studentClass) {
                // If student info is not available, stop loading and set error
                setLoading(false);
                setError('Student information not available. Please ensure you are logged in.');
                return;
            }

            // Fetch study materials for the student's class
            // The filtering by subject will now happen client-side after fetching all materials for the class
            const response = await fetch(`http://localhost:3000/api/student/study-materials?studentId=${studentId}&class=${studentClass}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            setMaterials(data);
            
            // Extract unique subjects from fetched materials for the filter dropdown
            const subjects = ['All', ...new Set(data.map(item => item.subject))];
            setSubjectOptions(subjects);
        } catch (error) {
            console.error("Could not fetch study materials:", error);
            setError("Failed to load study materials.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSubjectChange = (e) => {
        setFilterSubject(e.target.value);
    };

    // Function to handle viewing a resource in a new tab
    const handleViewResource = (downloadUrl) => {
        // Construct the full URL and open in a new tab
        window.open(`http://localhost:3000${downloadUrl}`, '_blank');
    };

    // Filter materials based on search term AND selected subject
    const filteredMaterials = materials.filter(material => {
        const matchesSearchTerm = material.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  (material.description && material.description.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesSubject = filterSubject === 'All' || material.subject === filterSubject;

        return matchesSearchTerm && matchesSubject;
    });

    return (
        <>
            <StudentNavbar />
            <div className="container my-5">
                <h3>Study Materials</h3>
                <p className="text-muted">Study materials available for Class {studentClass}</p>

                {/* Search and filter controls */}
                <div className="card p-3 mb-4">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <InputGroup>
                                <InputGroup.Text><FaSearch /></InputGroup.Text>
                                <Form.Control
                                    placeholder="Search files..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </InputGroup>
                        </div>
                        <div className="col-md-6">
                            <Form.Select 
                                value={filterSubject} 
                                onChange={handleSubjectChange}
                            >
                                {subjectOptions.map((subject) => (
                                    <option key={subject} value={subject}>{subject}</option>
                                ))}
                            </Form.Select>
                        </div>
                    </div>
                </div>

                {loading && <div className="text-center my-5"><div className="spinner-border" role="status"></div></div>}
                {error && <Alert variant="danger">{error}</Alert>}
                
                {!loading && !error && filteredMaterials.length === 0 && (
                    <Alert variant="info">
                        No study materials available {filterSubject !== 'All' ? `for ${filterSubject}` : ''}.
                    </Alert>
                )}

                {!loading && !error && filteredMaterials.length > 0 && (
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>File Name</th>
                                <th>Subject</th>
                                <th>Upload Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMaterials.map((material) => (
                                <tr key={material._id}>
                                    <td>{material.fileName}</td>
                                    <td>{material.subject}</td>
                                    <td>{new Date(material.uploadDate).toLocaleDateString()}</td>
                                    <td>
                                        {/* This button now acts as the "View" button */}
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => handleViewResource(material.downloadUrl)}
                                            title="View Document"
                                        >
                                            <FaEye className="me-1" /> View Document
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>
            <StudentFooter />
        </>
    );
};

export default StudyMaterials;
