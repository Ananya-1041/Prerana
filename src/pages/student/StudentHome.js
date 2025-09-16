// StudentHome.js
import React, { useState, useEffect } from 'react';
import StudentNavbar from '../../components/StudentNavbar';
import StudentFooter from '../../components/StudentFooter';
import { Card } from 'react-bootstrap';
import { FaFileDownload, FaBook, FaFileAlt, FaEye } from 'react-icons/fa';
import '../../styles/StudentHome.css';

const StudentHome = () => {
    const [resourceCounts, setResourceCounts] = useState({ questionPapers: 0, studyMaterials: 0 });
    const [recentResources, setRecentResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const studentId = localStorage.getItem('studentId');

    useEffect(() => {
        if (!studentId) {
            setError('Student ID not found. Please login again.');
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch resource counts
                const countsResponse = await fetch(`http://localhost:3000/api/student/home-counts?studentId=${studentId}`);
                if (!countsResponse.ok) {
                    throw new Error(`Failed to fetch counts: ${countsResponse.status}`);
                }
                const countsData = await countsResponse.json();
                setResourceCounts(countsData);

                // Fetch recent materials
                const materialsResponse = await fetch(`http://localhost:3000/api/student/recent-materials?studentId=${studentId}`);
                if (!materialsResponse.ok) {
                    throw new Error(`Failed to fetch materials: ${materialsResponse.status}`);
                }
                const materialsData = await materialsResponse.json();
                setRecentResources(materialsData);
                
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [studentId]);

    // MODIFIED: Directly open the downloadUrl which points to the static /uploads route
    const handleViewResource = (downloadUrl) => {
        window.open(`http://localhost:3000${downloadUrl}`, '_blank');
    };

    if (loading) {
        return (
            <>
                <StudentNavbar />
                <div className="container my-5">
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p>Loading your dashboard...</p>
                    </div>
                </div>
                <StudentFooter />
            </>
        );
    }

    if (error) {
        return (
            <>
                <StudentNavbar />
                <div className="container my-5">
                    <div className="alert alert-danger" role="alert">
                        <h4 className="alert-heading">Error!</h4>
                        <p>{error}</p>
                    </div>
                </div>
                <StudentFooter />
            </>
        );
    }

    return (
        <>
            <StudentNavbar />
            <div className="container my-5">
                <h2>Welcome Back, Student!</h2>
                <p className="text-muted">Student ID: {studentId}</p>
                
                <div className="d-flex gap-3 flex-wrap my-4">
                    <Card 
                        style={{ width: '18rem', cursor: 'pointer' }} 
                        onClick={() => window.location.href = '/student/question-papers'}
                        className="shadow-sm hover-card"
                    >
                        <Card.Body>
                            <Card.Title>
                                <FaFileAlt className="me-2 text-primary" /> 
                                Question Papers
                            </Card.Title>
                            <Card.Text className="fs-4 fw-bold text-success">
                                {resourceCounts.questionPapers} papers available
                            </Card.Text>
                            <small className="text-muted">Click to view all question papers</small>
                        </Card.Body>
                    </Card>

                    <Card 
                        style={{ width: '18rem', cursor: 'pointer' }} 
                        onClick={() => window.location.href = '/student/study-materials'}
                        className="shadow-sm hover-card"
                    >
                        <Card.Body>
                            <Card.Title>
                                <FaBook className="me-2 text-info" /> 
                                Study Materials
                            </Card.Title>
                            <Card.Text className="fs-4 fw-bold text-success">
                                {resourceCounts.studyMaterials} materials available
                            </Card.Text>
                            <small className="text-muted">Materials for your class only</small>
                        </Card.Body>
                    </Card>
                </div>

                {/* <h4 className="mt-5 mb-3">
                    <FaFileDownload className="me-2" />
                    Recently Added Study Materials
                </h4> */}
                
                {/* {recentResources.length > 0 ? (
                    <div className="list-group">
                        {recentResources.map((resource, index) => (
                            <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                <div className="flex-grow-1">
                                    <div className="d-flex w-100 justify-content-between">
                                        <h6 className="mb-1">{resource.fileName}</h6>
                                        <small className="text-muted">
                                            {new Date(resource.uploadDate).toLocaleDateString()}
                                        </small>
                                    </div>
                                    <p className="mb-1">
                                        <span className="badge bg-secondary me-2">{resource.subject}</span>
                                        <small className="text-muted">
                                            Uploaded: {new Date(resource.uploadDate).toLocaleString()}
                                        </small>
                                    </p>
                                </div>
                                <div className="btn-group" role="group">
                                    
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => handleViewResource(resource.downloadUrl)}
                                        title="View Resource"
                                    >
                                        <FaFileDownload className="me-1" />
                                        Download
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="alert alert-info" role="alert">
                        <FaBook className="me-2" />
                        No study materials have been uploaded for your class yet. Check back later!
                    </div>
                )}

                {recentResources.length === 0 && resourceCounts.studyMaterials === 0 && (
                    <div className="alert alert-warning mt-3" role="alert">
                        <strong>No Resources Available</strong><br />
                        It looks like no study materials have been uploaded for your class yet. 
                        Please check with your teachers or come back later.
                    </div>
                )} */}
            </div>
            <StudentFooter />
        </>
    );
};

export default StudentHome;