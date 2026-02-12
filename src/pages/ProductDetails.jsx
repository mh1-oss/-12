import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();
    const [selectedImage, setSelectedImage] = useState(0);
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`https://api.escuelajs.co/api/v1/products/${id}`);
                setProduct(response.data);

                // Fetch related products from the same category
                const categoryRes = await axios.get(`https://api.escuelajs.co/api/v1/categories/${response.data.category.id}/products`);

                // Filter: valid images, not the current product, limit to 4
                const validRelated = categoryRes.data.filter(p =>
                    p.id !== response.data.id &&
                    p.images.length > 0 &&
                    p.images[0].startsWith('http') &&
                    !p.images[0].includes('placeimg.com')
                ).slice(0, 4);

                setRelatedProducts(validRelated);
                setLoading(false);
                setSelectedImage(0); // Reset image on product change
                window.scrollTo(0, 0); // Scroll to top
            } catch (err) {
                setError("Failed to load product details.");
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!product) return <div className="error-message">Product not found</div>;

    return (
        <div className="product-details-container">
            <div className="product-details-grid">
                <div className="product-gallery">
                    <div className="main-image-container">
                        <img src={product.images[selectedImage]} alt={product.title} className="main-image" />
                    </div>
                    <div className="thumbnail-list">
                        {product.images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`${product.title} ${index + 1}`}
                                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                onClick={() => setSelectedImage(index)}
                            />
                        ))}
                    </div>
                </div>

                <div className="product-info-column">
                    <span className="product-category">{product.category.name}</span>
                    <h1 className="product-title-large">{product.title}</h1>
                    <p className="product-price-large">${product.price}</p>

                    <p className="product-description">{product.description}</p>

                    <div className="product-actions">
                        <button
                            className="add-to-cart-large"
                            onClick={() => addToCart(product)}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>

            {relatedProducts.length > 0 && (
                <div className="related-products-section">
                    <h2 className="section-title">You Might Also Like</h2>
                    <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                        {relatedProducts.map((item) => (
                            <div key={item.id} className="product-card">
                                <Link to={`/product/${item.id}`} className="image-container" style={{ aspectRatio: '1', display: 'block' }}>
                                    <img src={item.images[0]} alt={item.title} className="product-image" />
                                </Link>
                                <div className="product-info">
                                    <Link to={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <h3 className="product-title" style={{ fontSize: '1rem' }}>{item.title}</h3>
                                    </Link>
                                    <div className="product-footer">
                                        <span className="price">${item.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
