import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Contact.css';
import axios from 'axios';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const backendUrl = 'http://localhost:3000'; // Backend URL

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(form).some(field => field.trim() === '')) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/contact`, form);
      alert(response.data.message);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' }); // Clear the form
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Failed to send message. Please try again later.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2>Contact Us</h2>
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="info-box p-3 shadow-sm">
              <h5>Address</h5>
              <p>Government High School,<br />Hanumanthapura, Gorur Road,<br />Hassan-573128</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="info-box p-3 shadow-sm">
              <h5>Phone Number</h5>
              <p>+91 98765 43210</p>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6 mb-3">
            <iframe
              title="school-location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.292323851116!2d76.09282107484103!3d12.953136987360573!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba5478ddc7fd923%3A0x2b8b1bde3fc99446!2sGovernment%20High%20School!5e0!3m2!1sen!2sin!4v1751518839498!5m2!1sen!2sin"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
          <div className="col-md-6">
            <div className="info-box p-3 shadow-sm h-100">
              <h5>School Office Hours</h5>
              <ul className="list-unstyled">
                <li><strong>Monday - Friday:</strong> 8:00 AM - 5:00 PM</li>
                <li><strong>Saturday:</strong> 9:00 AM - 1:00 PM</li>
                <li><strong>Sunday:</strong> Closed</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="message-form shadow-sm p-4 mb-5 bg-light">
          <h4>Send Us a Message</h4>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  name="subject"
                  className="form-control"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12 mb-3">
                <textarea
                  name="message"
                  className="form-control"
                  rows="4"
                  placeholder="Message"
                  value={form.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="col-12 text-end">
                <button type="submit" className="btn btn-primary">
                  Send Message
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;