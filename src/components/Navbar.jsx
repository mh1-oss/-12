import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { getCartCount } = useCart();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false); // New state for dropdown

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
            setShowSearch(false);
            setSearchQuery('');
            setIsMenuOpen(false);
        }
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? '✕' : '☰'}
                </button>

                <Link to="/" className="nav-logo">
                    LuxeMarket
                </Link>

                {/* Desktop Links (Centered) */}
                <div className={`nav-links ${isMenuOpen ? 'mobile-open' : ''}`}>
                    <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link to="/shop" className="nav-link" onClick={() => setIsMenuOpen(false)}>Shop</Link>
                    <Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>About</Link>
                    {user && user.role === 'admin' && <Link to="/admin" className="nav-link" onClick={() => setIsMenuOpen(false)}>Admin</Link>}

                    {/* Mobile Only: User Info */}
                    {user && isMenuOpen && (
                        <div className="mobile-user-section">
                            <hr style={{ width: '80%', opacity: 0.2, margin: '1rem 0' }} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <img src={user.avatar} alt={user.name} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                                <span style={{ fontWeight: 600 }}>{user.name}</span>
                            </div>
                            <button onClick={() => { logout(); setIsMenuOpen(false) }} className="logout-btn">
                                Logout
                            </button>
                        </div>
                    )}
                    {/* Mobile Only: Login if not user */}
                    {!user && isMenuOpen && (
                        <div className="mobile-user-section" style={{ marginTop: '1rem' }}>
                            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                <button className="login-btn">Login</button>
                            </Link>
                        </div>
                    )}
                </div>

                <div className="nav-actions">
                    {/* Search Bar */}
                    <div className={`search-wrapper ${showSearch ? 'active' : ''}`}>
                        <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onBlur={() => {
                                    // Delay hiding to allow submit
                                    setTimeout(() => {
                                        if (!searchQuery) setShowSearch(false)
                                    }, 200);
                                }}
                                autoFocus={showSearch}
                            />
                        </form>
                    </div>
                    <button className="icon-btn" onClick={() => setShowSearch(!showSearch)}>🔍</button>

                    <button className="icon-btn" style={{ position: 'relative' }} onClick={() => navigate('/cart')}>
                        🛒
                        {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
                    </button>

                    {/* Desktop User Avatar with Dropdown */}
                    {user ? (
                        <div className="user-menu-desktop">
                            <div
                                className="avatar-wrapper"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="user-avatar"
                                />
                            </div>

                            {/* Dropdown Menu */}
                            {showUserMenu && (
                                <div className="user-dropdown">
                                    <div className="dropdown-item user-info">
                                        <strong>{user.name}</strong>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <button
                                        onClick={() => { logout(); setShowUserMenu(false) }}
                                        className="dropdown-item logout-link"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="desktop-login-btn">
                            <button className="login-btn">Login</button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
