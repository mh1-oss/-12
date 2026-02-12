import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { Link, useSearchParams } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    const { addToCart } = useCart();

    const isMiscCategory = (name) => {
        const lower = name.toLowerCase();
        return lower.includes('change') || lower.includes('new') || lower.includes('cat') || /^\d/.test(name) || name.includes('-');
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://api.escuelajs.co/api/v1/products');

                // Allow letters, spaces, numbers, and common punctuation like &, -, ', etc.
                const isCleanCategory = (name) => /^[a-zA-Z0-9\s&'-]+$/.test(name) && !/test/i.test(name) && name.length < 40;

                // 2. Fetch Local & Deleted data
                const localProducts = JSON.parse(localStorage.getItem('local_products') || '[]');
                const deletedIds = JSON.parse(localStorage.getItem('deleted_products') || '[]');

                // 3. Filter API products: 
                //    - Must be valid images/categories
                //    - Must NOT be in deleted_products
                //    - Must NOT be in local_products (Overrides)

                const localIds = new Set(localProducts.map(p => p.id));
                const deletedSet = new Set(deletedIds);

                const validApiProducts = response.data.filter(product =>
                    product.images.length > 0 &&
                    product.images[0].startsWith('http') &&
                    !product.images[0].includes('placeimg.com') &&
                    isCleanCategory(product.category.name) &&
                    !deletedSet.has(product.id) &&
                    !localIds.has(product.id)
                );

                // 4. Merge Local Products (Local first)
                const allProducts = [...localProducts, ...validApiProducts];

                // 5. Extract categories
                const productCategories = allProducts.map(p =>
                    isMiscCategory(p.category.name) ? 'Others' : p.category.name
                );

                const uniqueCategories = ['All', ...new Set(productCategories)];

                setProducts(allProducts);
                setFilteredProducts(allProducts);
                setCategories(uniqueCategories);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Filter by Category AND Search Query
        let result = products;

        if (activeCategory !== "All") {
            result = result.filter(p => {
                if (activeCategory === "Others") {
                    return isMiscCategory(p.category.name);
                }
                return p.category.name === activeCategory;
            });
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.category.name.toLowerCase().includes(query)
            );
        }

        setFilteredProducts(result);
    }, [activeCategory, products, searchQuery]);

    if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

    return (
        <div className="home-container">
            <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Shop All</h1>

            <div className="shop-filters">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="product-grid">
                {filteredProducts.map((product) => (
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
                            <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                                <h3 className="product-title">{product.title}</h3>
                            </Link>
                            <div className="product-footer">
                                <span className="price">${product.price}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Shop;
