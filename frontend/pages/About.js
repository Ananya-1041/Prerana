import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/About.css'; // Create this if needed

export default function About() {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="mb-4">About Us</h2>
        <div className="row align-items-center">
          {/* Image Section */}
          <div className="col-md-6 mb-3">
            <img
              src="/img1.jpg" // Place this image inside the public folder
              alt="School"
              className="img-fluid rounded about-img"
            />
          </div>

          {/* Text Section */}
          <div className="col-md-6">
            <p><strong>History:</strong> Established in 1965, Prerana GHS has a legacy of nurturing generations of students.</p>
            <p><strong>Vision & Mission:</strong> Empower students through holistic education, discipline, and innovation.</p>
            <p><strong>Principal’s Message:</strong> "We aim to foster lifelong learners and responsible citizens."</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
