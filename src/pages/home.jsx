import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://api.escuelajs.co/api/v1/products');

                const localProducts = JSON.parse(localStorage.getItem('local_products') || '[]');
                const deletedIds = JSON.parse(localStorage.getItem('deleted_products') || '[]');

                const localIds = new Set(localProducts.map(p => p.id));
                const deletedSet = new Set(deletedIds);

                const validApiProducts = response.data.filter(product =>
                    product.images.length > 0 &&
                    product.images[0].startsWith('http') &&
                    !product.images[0].includes('placeimg.com') &&
                    !deletedSet.has(product.id) &&
                    !localIds.has(product.id)
                );

                // Merge and limit
                setProducts([...localProducts, ...validApiProducts].slice(0, 8));
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="home-container">
            <header className="hero-section">
                <h1 className="hero-title">Exclusive Collection</h1>
                <p className="hero-subtitle">Discover the latest trends in fashion and technology.</p>
            </header>

            <main className="product-grid">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        <div className="image-container">
                            <Link to={`/product/${product.id}`}>
                                <img src={product.images[0]} alt={product.title} className="product-image" />
                            </Link>
                            <div className="overlay">
                                <button
                                    className="add-to-cart-btn"
                                    onClick={() => addToCart(product)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                        <div className="product-info">
                            <span className="category-tag">{product.category.name}</span>
                            <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <h3 className="product-title">{product.title}</h3>
                            </Link>
                            <div className="product-footer">
                                <span className="price">${product.price}</span>
                                <div className="rating">
                                    <span className="star">★</span> 4.5
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
};

export default Home;
