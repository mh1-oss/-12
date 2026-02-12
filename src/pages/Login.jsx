import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const fillCredentials = (role) => {
        if (role === 'admin') {
            setFormData({ email: 'admin@mail.com', password: 'admin123' });
        } else {
            setFormData({ email: 'john@mail.com', password: 'changeme' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData.email, formData.password);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password.');
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2 className="login-title">Welcome Back</h2>
                    <p className="login-subtitle">Please sign in to your account</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="login-input"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            className="login-input"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <div className="login-footer">
                        <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Quick Login for Testing:</p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                type="button"
                                onClick={() => fillCredentials('admin')}
                                className="filter-btn"
                                style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem', textAlign: 'center' }}
                            >
                                Admin
                            </button>
                            <button
                                type="button"
                                onClick={() => fillCredentials('customer')}
                                className="filter-btn"
                                style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem', textAlign: 'center' }}
                            >
                                Customer
                            </button>
                        </div>
                        <div className="demo-credentials">
                            <p><strong>Admin:</strong> admin@mail.com / admin123</p>
                            <p><strong>Customer:</strong> john@mail.com / changeme</p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
