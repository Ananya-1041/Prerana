import React, { useState, useEffect } from 'react';
import StudentNavbar from '../../components/StudentNavbar';
import StudentFooter from '../../components/StudentFooter';
import { Table, Form, InputGroup, Alert } from 'react-bootstrap';
import { FaDownload, FaEye, FaSearch } from 'react-icons/fa';

const QuestionPapers = () => {
    const [papers, setPapers] = useState([]);
    const [classes, setClasses] = useState(['All']); // Renamed from subjects to classes
    const [years, setYears] = useState(['All']);
    const [selectedClass, setSelectedClass] = useState('All'); // Renamed from selectedSubject to selectedClass
    const [selectedYear, setSelectedYear] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const studentId = localStorage.getItem('studentId'); // Get studentId

    useEffect(() => {
        fetchQuestionPapers();
    }, [selectedClass, selectedYear, studentId]); // Changed dependency to selectedClass

    const fetchQuestionPapers = async () => {
        setLoading(true);
        setError('');
        try {
            if (!studentId) {
                throw new Error('Student ID not found in localStorage. Please login again.');
            }

            // Changed query parameter to studentClass instead of subject
            const response = await fetch(`http://localhost:3000/api/student/question-papers?studentId=${studentId}&studentClass=${selectedClass}&year=${selectedYear}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setPapers(data);

            // Populate classes and years for filter dropdowns
            const uniqueClasses = ['All', ...new Set(data.map(paper => paper.class))]; // Map to paper.class
            const uniqueYears = ['All', ...new Set(data.map(paper => paper.year))];
            setClasses(uniqueClasses); // Set classes
            setYears(uniqueYears);
        } catch (error) {
            console.error("Could not fetch question papers:", error);
            setError("Failed to load question papers. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Changed handler name and state update
    const handleClassChange = (event) => setSelectedClass(event.target.value);
    const handleYearChange = (event) => setSelectedYear(event.target.value);
    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    const handleViewPdf = (viewUrl) => {
        window.open(`http://localhost:3000${viewUrl}`, '_blank');
    };

    const filteredPapers = papers.filter(paper => {
        // Updated search logic to include class and subject, and removed fileName as it's not displayed
        const matchesSearchTerm = (paper.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  (paper.year || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  (paper.class || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  (paper.type || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearchTerm;
    });

    return (
        <>
            <StudentNavbar />
            <div className="container my-5">
                <h3>Previous Year Question Papers</h3>

                {/* Search and filter controls */}
                <div className="card p-3 mb-4">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <InputGroup>
                                <InputGroup.Text><FaSearch /></InputGroup.Text>
                                <Form.Control
                                    placeholder="Search papers..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </InputGroup>
                        </div>
                        <div className="col-md-4">
                            {/* Changed label and select to use classes */}
                            <Form.Select
                                value={selectedClass}
                                onChange={handleClassChange} // Changed handler
                            >
                                {classes.map((className) => ( // Mapped over classes
                                    <option key={className} value={className}>{className}</option>
                                ))}
                            </Form.Select>
                        </div>
                        <div className="col-md-4">
                            <Form.Select
                                value={selectedYear}
                                onChange={handleYearChange}
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </Form.Select>
                        </div>
                    </div>
                </div>

                {loading && <div className="text-center my-5"><div className="spinner-border" role="status"></div></div>}
                {error && <Alert variant="danger">{error}</Alert>}

                {!loading && !error && filteredPapers.length === 0 && (
                    <Alert variant="info">
                        No question papers available for the selected filters.
                    </Alert>
                )}

                {!loading && !error && filteredPapers.length > 0 && (
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Class</th> {/* Ensures Class header is present */}
                                <th>Year</th>
                                <th>Exam Type</th>
                                <th>Upload Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPapers.map((paper) => (
                                <tr key={paper._id}>
                                    <td>{paper.subject}</td>
                                    <td>{paper.class}</td> {/* Displays Class */}
                                    <td>{paper.year}</td>
                                    <td>{paper.type || 'N/A'}</td>
                                    <td>{new Date(paper.uploadDate).toLocaleDateString()}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            {/* View Button */}
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => handleViewPdf(paper.viewUrl)}
                                                title="View Document"
                                            >
                                                <FaEye className="me-1" /> View Document
                                            </button>
                                        </div>
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

export default QuestionPapers;