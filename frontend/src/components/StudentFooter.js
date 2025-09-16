import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Prerana Government High School. All rights reserved.</p>
      </div>
    </footer>
  );
}
