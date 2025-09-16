import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Events.css';
import axios from 'axios';

const Events = () => {
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [mongoEvents, setMongoEvents] = useState([]);

  // ✅ Default hardcoded events
  const defaultEvents = [
    {
      id: 'default1',
      name: 'Science Fair',
      date: '2025-05-10',
      time: '10:00 AM - 2:00 PM',
      description: 'Annual science exhibition by students of classes 6 to 10.',
    },
    {
      id: 'default2',
      name: 'Sports Day',
      date: '2025-06-15',
      time: '8:00 AM - 4:00 PM',
      description: 'Various sports competitions and prize distribution ceremony.',
    },
    {
      id: 'default3',
      name: 'Cultural Fest',
      date: '2025-05-20',
      time: '5:00 PM - 9:00 PM',
      description: 'Music, dance, and drama performances by students.',
    },
    {
      id: 'default4',
      name: 'Art Exhibition',
      date: '2025-07-25',
      time: '11:00 AM - 3:00 PM',
      description: 'Display of student artwork and painting competition results.',
    }
  ];

  const backendUrl = 'http://localhost:3000';

  // ✅ Fetch events from MongoDB
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/events`);
        setMongoEvents(response.data);
      } catch (error) {
        console.error('Error fetching events from MongoDB:', error);
      }
    };
    fetchEvents();
  }, []);

  const getMonthFromDate = (dateStr) => new Date(dateStr).getMonth(); // 0 = Jan

  // ✅ Combine default events + DB events
  const allEvents = [...defaultEvents, ...mongoEvents];

  const filteredEvents =
    selectedMonth === 'all'
      ? allEvents
      : allEvents.filter((event) => getMonthFromDate(event.date) === parseInt(selectedMonth));

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2>Upcoming Events</h2>
        <div className="mb-4 d-flex justify-content-center">
          <select
            className="form-select w-auto"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="all">All Months</option>
            {[...Array(12).keys()].map((month) => (
              <option key={month} value={month}>
                {new Date(0, month).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>

        <div className="d-flex flex-wrap justify-content-center gap-3">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event._id || event.id} className="card event-card p-3">
                <h5 className="card-title">{event.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  {new Date(event.date).toLocaleDateString()} | {event.time}
                </h6>
                <p className="card-text">{event.description}</p>
              </div>
            ))
          ) : (
            <p>No events found for this month.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Events;