import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
      <Link className="navbar-brand" to="/">Prerana GHS</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          {['Home', 'About', 'Announcements', 'Events', 'Contact'].map(page => (
            <li className="nav-item" key={page}>
              <Link className="nav-link" to={`/${page.toLowerCase()}`}>{page}</Link>
            </li>
          ))}
          <li className="nav-item">
            <Link className="btn btn-outline-light" to="/login">Login</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
