import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-section">
                    <h3 className="footer-title">LuxeMarket</h3>
                    <p className="footer-text">
                        Elevating your shopping experience with the finest products.
                        Quality, style, and luxury in every item.
                    </p>
                </div>

                <div className="footer-section">
                    <h4 className="footer-subtitle">Quick Links</h4>
                    <ul className="footer-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/shop">Shop</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/cart">My Cart</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4 className="footer-subtitle">Contact Us</h4>
                    <p className="footer-text">123 Fashion Ave, New York, NY 10001</p>
                    <p className="footer-text">Email: support@luxemarket.com</p>
                    <p className="footer-text">Phone: +1 (555) 123-4567</p>
                </div>

                <div className="footer-section">
                    <h4 className="footer-subtitle">Follow Us</h4>
                    <div className="social-icons">
                        <span className="social-icon">IG</span>
                        <span className="social-icon">FB</span>
                        <span className="social-icon">TW</span>
                        <span className="social-icon">LI</span>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} LuxeMarket. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
