import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Announcements.css';
import axios from 'axios';

const Announcements = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const backendUrl = 'http://localhost:3000'; // Backend URL

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/announcements`);
        setAnnouncements(response.data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
        // Consider showing a user-friendly error message here, e.g., using a state variable
        // setErrorMessage('Failed to load announcements. Please try again later.');
      }
    };

    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = announcements.filter((a) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2>Announcements</h2>
        <div className="d-flex justify-content-center mb-4 gap-2">
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredAnnouncements.length === 0 ? (
          <p>No announcements available.</p>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {filteredAnnouncements.map((announcement) => (
              <div key={announcement._id} className="col">
                <div className="card h-100 rounded-3 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{announcement.title}</h5>
                    <p className="card-text">{announcement.description}</p>
                    <p className="card-text">
                      <small className="text-muted">{new Date(announcement.date).toLocaleDateString()}</small>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Announcements;