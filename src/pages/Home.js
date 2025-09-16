import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Carousel from 'react-bootstrap/Carousel';
import '../styles/Home.css';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="container home-container">
        <div className="welcome-section">
          <h2>Welcome to Prerana Government High School</h2>
          <p>A place where excellence meets opportunity. Our mission is to provide quality education to every child.</p>
        </div>

        <Carousel className="mb-4">
          <Carousel.Item>
            <img className="d-block w-100 carousel-img" src="/img1.jpg" alt="Slide 1" />
            <Carousel.Caption>
              <h3>Excellence in Education</h3>
              <p>Nurturing young minds for a brighter future</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100 carousel-img" src="/img3.jpg" alt="Slide 2" />
            <Carousel.Caption>
              <h3>Modern Facilities</h3>
              <p>State-of-the-art infrastructure for better learning</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100 carousel-img" src="/img2.jpg" alt="Slide 3" />
            <Carousel.Caption>
              <h3>Holistic Development</h3>
              <p>Focusing on academic and personal growth</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>

        <div className="announcements-section">
          <h4>Recent Announcements</h4>
          <ul>
            <li>School reopening on June 1st.</li>
            <li>New library inaugurated.</li>
          </ul>
        </div>

        <div className="events-section">
          <h4>Upcoming Events</h4>
          <ul>
            <li>Annual Sports Day – June 15th</li>
            <li>Science Fair – July 10th</li>
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
}
