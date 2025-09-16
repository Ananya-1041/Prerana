import React, { useState, useEffect } from 'react';
import StudentNavbar from '../../components/StudentNavbar';
import StudentFooter from '../../components/StudentFooter';
import { FaDownload, FaEye } from 'react-icons/fa'; // Import FaEye for view icon
import { format } from 'date-fns'; // Import date-fns for date formatting

const Timetable = () => {
    const [timetableData, setTimetableData] = useState(null); // Initialize as null to distinguish between no data and loading
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const studentId = localStorage.getItem('studentId'); // Get studentId

    useEffect(() => {
        if (studentId) {
            fetchTimetable();
        } else {
            setError("Student ID not found. Please log in.");
            setLoading(false); // Stop loading if no studentId
        }
    }, [studentId]);

    const fetchTimetable = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`http://localhost:3000/api/student/timetable?studentId=${studentId}`); // Explicitly use full URL

            // IMPORTANT: Log the response status and content type
            console.log('Timetable API Response Status:', response.status);
            console.log('Timetable API Content-Type:', response.headers.get('Content-Type'));

            if (!response.ok) {
                // If the response is not OK, try to read it as text first
                const errorText = await response.text();
                console.error('Timetable API Error Response Body:', errorText);

                // Check for specific 404 message from backend (which should be JSON)
                if (response.status === 404 && response.headers.get('Content-Type')?.includes('application/json')) {
                    try {
                        const errorJson = JSON.parse(errorText); // Try to parse as JSON if content-type is JSON
                        setTimetableData(null);
                        setError(errorJson.message || 'Timetable not found for your class.');
                    } catch (parseError) {
                        // If it's 404 but not JSON, or JSON parsing fails, treat as generic error
                        setTimetableData(null);
                        setError(`Timetable not found for your class or server responded with non-JSON 404. Details: ${errorText.substring(0, 100)}...`);
                    }
                } else {
                    // For other non-OK responses or non-JSON 404s
                    setTimetableData(null);
                    setError(`Failed to load timetable. Server responded with status: ${response.status}. Details: ${errorText.substring(0, 100)}...`);
                }
                return; // Exit as there's no data to process
            }

            // If response is OK, it *should* be JSON.
            // Check content type before parsing as JSON
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                setTimetableData(data);
            } else {
                const textResponse = await response.text();
                console.error('Expected JSON, but received:', contentType, textResponse);
                setError('Failed to load timetable: Unexpected server response format. Expected JSON.');
                setTimetableData(null);
            }

        } catch (err) {
            console.error(`Network or parsing error fetching timetable for student ${studentId}:`, err);
            setError(`Failed to load timetable (Network/Parsing Issue). Please try again. ${err.message}`);
            setTimetableData(null); // Ensure data is cleared on error
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (timetableData && timetableData.downloadUrl) {
            window.open(`http://localhost:3000${timetableData.downloadUrl}`, '_blank'); // Explicitly add base URL
        } else {
            alert('No timetable available to download.');
        }
    };

    const handleView = () => {
        if (timetableData && timetableData.viewUrl) {
            window.open(`http://localhost:3000${timetableData.viewUrl}`, '_blank'); // Explicitly add base URL
        } else {
            alert('No timetable available to view.');
        }
    };

    return (
        <>
            <StudentNavbar />
            <div className="container my-5">
                <h3>Class Timetable</h3>

                {loading && <p>Loading timetable...</p>}
                {error && <p className="text-danger">{error}</p>}

                {!loading && !error && (
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Class</th>
                                    <th>Upload Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {timetableData ? (
                                    <tr>
                                        <td>{timetableData.class}</td>
                                        <td>{format(new Date(timetableData.uploadDate), 'dd-MM-yyyy HH:mm')}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={handleView}
                                                disabled={!timetableData.viewUrl}
                                                title="View Document"
                                            >
                                                <FaEye /> View Document
                                            </button>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center">No timetable available for your class.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <StudentFooter />
        </>
    );
};

export default Timetable;